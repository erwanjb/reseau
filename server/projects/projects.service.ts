import { Injectable, UnsupportedMediaTypeException , NotFoundException, ConflictException} from '@nestjs/common';
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
import { InsertResult, UpdateResult, DeleteResult } from "typeorm";

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

    async create(userId, req, res) {
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
            const { role, title, time, description, categories } = body;
            const project = { title, description, time, picture: fileNameToUpload, status: StatusEnumProject.ENABLED };
            const categoriesToSend = JSON.parse(categories).map(cat => ({ name: cat}));
            const userProject = {userId, role, adminRole: AdminRoleEnum.OWNER, invitation: true, demande: true}
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

    async isNotAUserTreatedGuard(curentUserId: string, projectId:string) {
        return this.projectRepository.isNotAUserTreatedGuard(curentUserId, projectId);
    }

    async demande(projectId: string, userId: string, messageDemande: string) {
        return this.projectRepository.demande(projectId, userId, messageDemande);
    }

    async messaging(projectId: string) {
        const userNotTreated = await this.projectRepository.messagingUserNotTreated(projectId);
        const userRefused = await this.projectRepository.messagingUserRefused(projectId);
        const project = await this.projectRepository.messaging(projectId);
        const userInvitedWaiting = await this.projectRepository.messagingUserWaiting(projectId);
        const userInvitedRefused = await this.projectRepository.messagingUserInvitedRefused(projectId);

        const {title, picture, ...payloadProject} = project;
        return {
            userNotTreated: userNotTreated ? userNotTreated.userProject.filter(userProj => userProj.user.status === StatusEnumUser.ENABLED).map(userProj => {
                const user = userProj.user;
                const { email, phone, password, status, ...payload } = user;
                return {...payload, messageDemande: userProj.messageDemande};
            }) : [],
            userRefused: userRefused ? userRefused.userProject.filter(userProj => userProj.user.status === StatusEnumUser.ENABLED).map(userProj => {
                const user = userProj.user;
                const { email, phone, password, status, ...payload } = user;
                return payload;
            }) : [],
            userInvitedWaiting: userInvitedWaiting ? userInvitedWaiting.userProject.filter(userProj => userProj.user.status === StatusEnumUser.ENABLED).map(userProj => {
                const user = userProj.user;
                const { email, phone, password, status, ...payload } = user;
                return {...payload, messageInvitation: userProj.messageInvitation};
            }) : [],
            userInvitedRefused: userInvitedRefused ? userInvitedRefused.userProject.filter(userProj => userProj.user.status === StatusEnumUser.ENABLED).map(userProj => {
                const user = userProj.user;
                const { email, phone, password, status, ...payload } = user;
                return payload;
            }) : [],
            project: {title, picture}
        }
    }

    async refuse(projectId: string, userId: string) {
        return this.projectRepository.refuse(projectId, userId);
    }

    async reinvite(projectId: string, userId: string, role: string) {
        return this.projectRepository.reinvite(projectId, userId, role);
    }

    async cancel(projectId: string, userId: string) {
        return this.projectRepository.cancel (projectId, userId)
    }

    async update(id, req, res) {
        const project: any = {} as any;
        const busboy = new Busboy({ headers: req.headers });
        let type = null;
        let fileNameToUpload: null | string = null;

        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
            //add checks for field names and extract those values, for example I am expecting a 
            //hidden field with name (vehicleId)
            if (fieldname === 'categories') {
                project[fieldname] = JSON.parse(val);
            } else if (fieldname === 'time') {
                project[fieldname] = parseInt(val);
            } else {
                project[fieldname] = val;
            }
            type = fieldname;        
        });

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
            const userLoaded: Project = { ...project } as Project;
            fileNameToUpload = `${Date.now()}_${filename}`;

            const found = await this.projectRepository.findOne({
                id,
                status: StatusEnumProject.ENABLED
            });

            if (!found) {
                res.status(409).send(new ConflictException("Project not exist"));
            }
   
            const supportedMimetypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            const verifyType = supportedMimetypes.includes(mimetype);
            if (verifyType) {
                await this.deletePicture(id);
                const saveTo = './dist-react/image/' + fileNameToUpload;
                file.pipe(fs.createWriteStream(saveTo));
                type = 'picture';
            }
            file.resume();
        });

        busboy.on('finish', async () => {
            const projectLoaded: Project = project as Project;
            projectLoaded.picture = fileNameToUpload;

            const found = await this.projectRepository.findOne({
                id,
            });

            if (!found) {
                res.status(409).send(new ConflictException("User not exist"));
            }

            await this.projectRepository.updateProject(id, type, projectLoaded);
            return res.status(201).send('OK');
        });

        return req.pipe(busboy);
    }

    async deletePicture(id: string) {
        const project = await this.projectRepository.findOne({
            id
        });

        const nameToFileDelete = project.picture;

        if (nameToFileDelete) {
            fs.unlinkSync('./dist-react/image/' + nameToFileDelete);
        }
    }

    async isAssigned(curentUserId: string, missionId: string) {
        return this.projectRepository.isAssigned(curentUserId, missionId);
    }

    async mission(missionId: string) {
        return this.projectRepository.mission(missionId);
    }

    async updateMission(id, req, res) {
        const mission: any = {} as any;
        const busboy = new Busboy({ headers: req.headers });
        let type = null;
        let fileNameToUpload: null | string = null;

        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
            //add checks for field names and extract those values, for example I am expecting a 
            //hidden field with name (vehicleId)
            
            mission[fieldname] = val;
            type = fieldname;        
        });

        busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
            const missionLoaded = { ...mission };
            fileNameToUpload = `${Date.now()}_${filename}`;

            const found = await this.projectRepository.findOneMission(id);

            if (!found.length) {
                res.status(409).send(new ConflictException("mission not exist"));
            }
   
            const supportedMimetypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            const verifyType = supportedMimetypes.includes(mimetype);
            if (verifyType) {
                await this.deletePictureMission(id);
                const saveTo = './dist-react/image/' + fileNameToUpload;
                file.pipe(fs.createWriteStream(saveTo));
                type = 'picture';
            }
            file.resume();
        });

        busboy.on('finish', async () => {
            const missionLoaded = mission;
            missionLoaded.picture = fileNameToUpload;

            const found = await this.projectRepository.findOneMission(id);

            if (!found.length) {
                res.status(409).send(new ConflictException("mission not exist"));
            }

            await this.projectRepository.updateMission(id, type, missionLoaded);
            return res.status(201).send('OK');
        });

        return req.pipe(busboy);
    }

    async deletePictureMission(id: string) {
        const found = await this.projectRepository.findOneMission(id);

        if (!found.length) {
            throw new ConflictException('mission not found')
        }
        const project = found[0];

        const nameToFileDelete = project.picture;

        if (nameToFileDelete) {
            fs.unlinkSync('./dist-react/image/' + nameToFileDelete);
        }
    }

    async isAdminFromMissionGuard(userId: string, missionId: string) {
        return this.projectRepository.isAdminFromMissionGuard(userId, missionId);
    }

    async missionAdmin(missionId: string) {
        const mission = await this.projectRepository.mission(missionId);
        const users = await this.projectRepository.missionUsersEventually(missionId);
        const members = await this.projectRepository.missionMember(missionId);
        return {...mission, users: users.map(user => {
            const { password, status, confirmToken, ...payload } = user;
            return payload;
        }),
            members: members.map(user => {
                const { password, status, confirmToken, ...payload } = user;
                return payload;
            })
        }
    }

    async updateMissionUser(id, req, res) {
        const busboy = new Busboy({ headers: req.headers });
        let users;
        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
            //add checks for field names and extract those values, for example I am expecting a 
            //hidden field with name (vehicleId)
            if (fieldname === 'users') {
                users = JSON.parse(val);
            } else {
                res.status(404).send(new ConflictException('users missing'))
            }       
        });

        busboy.on('finish', async () => {
            res.status(200).send( await this.projectRepository.updateMissionUser(id, users))
        })

        return req.pipe(busboy);
    }

    changeRole(projectId: string, userId: string, role: string) {
        return this.projectRepository.changeRole(projectId, userId, role);
    }

    async promouvoir(projectId: string, userId: string) {
        return this.projectRepository.promouvoir(projectId, userId)
    }

    async retrograder(projectId: string, userId: string) {
        return this.projectRepository.retrograder(projectId, userId)
    }
}
