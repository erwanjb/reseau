import { Injectable, UnsupportedMediaTypeException , NotFoundException} from '@nestjs/common';
import { ProjectRepository } from "./projects.repository";
import Busboy from "busboy";
import fs from "fs";
import { StatusEnum as StatusEnumProject } from "./enums/statusEnum";
import { StatusEnum as StatusEnumUser } from "../users/enums/statusEnum";
import { AdminRoleEnum } from "./enums/adminRoleEnum";
import { Category } from "./categories.entity";
import { User } from "../users/users.entity";
import {Project} from "./projects.entity";
import { Connection } from "typeorm"
import { Mission } from './mission.entity';

interface Body {
    userId: string;
    role: string; 
    title: string; 
    description: string, 
    categories: string,
    time: number,
}

interface BodyMission {
    name: string;
    description: string;
    time: string;
    users: string;
}

interface UserToSend {
    id: string
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    adminRole: AdminRoleEnum;
}

interface MissionToSend extends Mission {
    id: string;
    name: string;
    description: string;
    users: UserToSend[];
    projectId: string;
    userMission: any[];
}

interface ProjectToSend extends Project {
    id: string;
    title: string;
    status: StatusEnumProject;
    description: string;
    categories: Category[];
    picture: string;
    userProject: any[];
    users: UserToSend[];
    missions: MissionToSend[]; 
}

@Injectable()
export class ProjectsService { 
    constructor(
        private projectRepository: ProjectRepository,
        private connection: Connection
    ){}

    async createFunction() {
        await this.connection.transaction(async manager => {
            manager.query(`
            CREATE FUNCTION MyFunction(myUserId VARCHAR(36), myMissionId VARCHAR(36)) 
            RETURNS VARCHAR(5) 
            BEGIN 
                DECLARE solution VARCHAR(5); 
                IF myUserId IN (SELECT userId FROM user_project WHERE projectId IN (SELECT projectId FROM mission WHERE mission.id = myMissionId ))
                THEN SET solution = 'True';
                ELSE SET solution = 'False';
                END IF;
                RETURN solution; 
            END
            `)
        })
    }

    async dropFunction() {
        await this.connection.transaction(async manager => {
            manager.query(`
            DROP FUNCTION IF EXISTS MyFunction
            `)
        })
    }

    async create(req, res) {
        const body = {} as Body;
        const busboy = new Busboy({ headers: req.headers });

        let fileNameToUpload: null | string = null;

        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
            //add checks for field names and extract those values, for example I am expecting a 
            //hidden field with name (vehicleId)
            body[fieldname] = val;        
        });

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
                fileNameToUpload = `${Date.now()}_${filename}`;
                const supportedMimetypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
                const verifyType = supportedMimetypes.includes(mimetype);
                if (verifyType) {
                    const saveTo = './dist-react/image/' + fileNameToUpload;
                    file.pipe(fs.createWriteStream(saveTo));
                } else {
                    res.status(415).send(new UnsupportedMediaTypeException("Media mimetype"));
                }
                file.resume();
        });

        busboy.on('finish', async () => {
            const { userId, role, title, time, description, categories } = body;
            const project = { title, description, time, picture: fileNameToUpload, status: StatusEnumProject.ENABLED };
            const categoriesToSend = JSON.parse(categories).map(cat => ({ name: cat}));
            const userProject = {userId, role, adminRole: AdminRoleEnum.OWNER }
            const response = await this.projectRepository.createProject(project, categoriesToSend, userProject);
            res.status(201).send(response);
        })
        return req.pipe(busboy);
    }

    async findProjectById (id) {
        const found = await this.projectRepository.findProjectById(id) as ProjectToSend;
        if (!found) {
            throw new NotFoundException();
        }

        if (found.status !== StatusEnumProject.ENABLED) {
            throw new NotFoundException();
        }

        found.users = found.userProject.filter(userProject => userProject.user.status === StatusEnumUser.ENABLED).map(userProject => {
            const { password, status, email, phone, ...userPayload} = userProject.user;        
            return {role: userProject.role, adminRole: userProject.adminRole, ...userPayload}
        });
        found.missions = found.missions.map((mission) => {
            const { userMission, projectId, ...missionPayload } = mission as MissionToSend;
            missionPayload.users = mission.userMission.filter(userMission => userMission.user.status === StatusEnumUser.ENABLED).map(userMission => {
                const { password, status, email, phone, ...userPayload} = userMission.user;
                return userPayload;
            })
            return missionPayload;
        }) as MissionToSend[];

        const {userProject, ...payload} = found;

        return payload;
    }

    async createMission(projectId: string, req, res) {
        const body = {} as BodyMission;
        const busboy = new Busboy({ headers: req.headers });

        let fileNameToUpload: null | string = null;

        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
            //add checks for field names and extract those values, for example I am expecting a 
            //hidden field with name (vehicleId)
            body[fieldname] = val;        
        });

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
                fileNameToUpload = `${Date.now()}_${filename}`;
                const supportedMimetypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
                const verifyType = supportedMimetypes.includes(mimetype);
                if (verifyType) {
                    const saveTo = './dist-react/image/' + fileNameToUpload;
                    file.pipe(fs.createWriteStream(saveTo));
                } else {
                    res.status(415).send(new UnsupportedMediaTypeException("Media mimetype"));
                }
                file.resume();
        });

        busboy.on('finish', async () => {
            const { name, description, time, users } = body;
            const mission = { name, description, time ,picture: fileNameToUpload, projectId, users: JSON.parse(users) };
            const response = await this.projectRepository.createMission(mission);
            res.status(201).send(response);
        })
        return req.pipe(busboy);
    }

    async getprojectsFilter(title: string, category: string) {
        return this.projectRepository.findProjectsWithFilters({ title, category });
    }

    async isPartner(curentUserId: string, partnerId: string) {
        return this.projectRepository.isPartner(curentUserId, partnerId);
    }

    async isAdmin(curentUserId: string, projectId:string) {
        return this.projectRepository.isAdmin(curentUserId, projectId);
    }

    async isOwner(curentUserId: string, projectId:string) {
        return this.projectRepository.isOwner(curentUserId, projectId);
    }

    async invite(projectId: string, userId: string, role: string, messageInvitation: string) {
        return this.projectRepository.invite(projectId, userId, role, messageInvitation);
    }
}
