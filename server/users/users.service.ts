import { Injectable, NotFoundException, ConflictException, UnsupportedMediaTypeException } from '@nestjs/common';
import { UserRepository } from "./users.repository";
import { User } from "./users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, UpdateResult, DeleteResult } from "typeorm";
import shA256  from "crypto-js/sha256";
import crypto from "crypto-js";
import Busboy from "busboy";
import fs from "fs";
import { StatusEnum as StatusEnumUser } from "./enums/statusEnum";
import { StatusEnum as StatusEnumProject } from "../projects/enums/statusEnum";
import transport from "../config/nodemailer.config";
import { Project } from '../projects/projects.entity';
import multer from "multer";

interface UserToSend extends User {
    projects: Project[]
}

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}


    async getAllUsersWithFilters(filters: GetUsersFilterDto): Promise<User[]> {
        return this.userRepository.findUsersWithFilters(filters);
    }

    async findByEmail(email: string): Promise<User> {
        const found = await this.userRepository.findOne({
            email,
        });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async findUserById(id: string) {
        const found: UserToSend = await this.userRepository.findUserById(id) as UserToSend;
        if (!found) {
            throw new NotFoundException();
        }

        found.projects = found.projectUser.filter(projectUser => projectUser.project.status === StatusEnumProject.ENABLED).map(projectUser => projectUser.project)
        const {projectUser, password, status, ...payload} = found;
        return payload;
    }

    async findByEmailEnabled(email: string): Promise<User> {
        const found = await this.userRepository.findOne({
            email,
            status: StatusEnumUser.ENABLED
        });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }



    async findById(id: string): Promise<User> {
        const found = await this.userRepository.findOne({
            id,
        });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async findByIdResetPassword(id: string, token: string) {
        const found = await this.userRepository.findOne({
            id,
            confirmToken: token,
            status: StatusEnumUser.ENABLED
        });

        if (!found) {
            throw new NotFoundException();
        }

        return found;
    }

    async verifyToken(token: string): Promise<boolean> {
        const found = await this.userRepository.findOne({
            confirmToken: token,
        });

        if (found) {
            return true;
        }

        return false;
    }

    async verifyEmailIfExist (email: string): Promise<boolean> {
        const found = await this.userRepository.findOne({
            email,
        });

        if (found) {
            return true;
        }
        return false;
    }

    async create(req, res): Promise<InsertResult> {
        const user: User = {} as User;
        const busboy = new Busboy({ headers: req.headers });

        let fileNameToUpload: null | string = null;

        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
            //add checks for field names and extract those values, for example I am expecting a 
            //hidden field with name (vehicleId)
            user[fieldname] = val;        
        });

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
            const userLoaded: User = { ...user } as User;
            fileNameToUpload = `${Date.now()}_${filename}`;
            if (!userLoaded.email) {
                res.status(400).send( new NotFoundException(`Pas d'email fourni avant l'image`))
            }
            const verifyEmailIfExist = await this.verifyEmailIfExist(userLoaded.email);
            if (!verifyEmailIfExist) {
                const supportedMimetypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
                const verifyType = supportedMimetypes.includes(mimetype);
                 if (verifyType) {
                    const saveTo = './dist-react/image/' + fileNameToUpload;
                    file.pipe(fs.createWriteStream(saveTo));
                } else {
                    res.status(415).send(new UnsupportedMediaTypeException("Media mimetype"));
                }
            }
            file.resume();
        });

        busboy.on('finish', async () => {
            const userLoaded: User = user as User;
            userLoaded.picture = fileNameToUpload;
            userLoaded.status = StatusEnumUser.TO_CONFIRM;
            const { email } = userLoaded;

            const found = await this.userRepository.findOne({
                email,
            });

            if (found) {
                res.status(409).send(new ConflictException("User already exists"));
            }

            let confirmToken;
            let verifyToken;
            do {
                confirmToken = crypto.lib.WordArray.random(16).toString();
                verifyToken = await this.verifyToken(confirmToken);
            } while (verifyToken);
            userLoaded.confirmToken = confirmToken;

            if (!found) {
                await this.createConfirmMail(userLoaded.email, confirmToken);
            }

            userLoaded.password = shA256(userLoaded.password, process.env.AUTH_SECRET).toString();
            const response = await this.userRepository.createUser(userLoaded);
            return res.status(201).send(response);
        });

        return req.pipe(busboy);
    }

    async updateUser(user: UpdateUserDto): Promise<UpdateResult> {
        return this.userRepository.updateUser(user);
    }

    async createConfirmMail(email: string, token: string) {
        transport.sendMail({
            from: 'ne-pas-repondre@reseau.fr',
            to: email,
            subject: 'confirmation de création de compte',
            html: `Un compte a été créé sur le reseau avec votre adresse mail, si c'est bien vous qui l'avez créé, clickez sur le lien <a href="${process.env.API_URL}/auth/confirmToken?token=${token}">ICI</a>` 
        })
    }

    async findByToken(token: string) {
        if (!token) {
            throw new NotFoundException();
        }

        const found = await this.userRepository.findOne({
            confirmToken: token,
        });

        if (!found) {
            throw new NotFoundException();
        }
        return found;
    }

    async enabled(id: string) {
        const user = await this.findById(id);

        user.status = StatusEnumUser.ENABLED;
        user.confirmToken = null;
        user.save();
    }
}
