import {
    Repository,
    EntityRepository,
    InsertResult,
    UpdateResult,
    Raw,
} from "typeorm";
import { ConflictException } from '@nestjs/common';
import { Project } from './projects.entity';
import { Category } from "./categories.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import {GetProjectsFilterDto} from "./dto/get-projects-filter.dto";
import { UserProject } from "./usersProjects.entity";
import { Mission } from './mission.entity';
import { UserMission } from './usersMissions.entity';
import { StatusEnum } from "./enums/statusEnum";
import { AdminRoleEnum } from "./enums/adminRoleEnum";
import { StatusEnum as StatusEnumUser } from "../users/enums/statusEnum";

interface Found extends Project {
    invitation: boolean;
    role: string;
    messageInvitation: string;
}

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
    async createProject(project: CreateProjectDto, categories, userProject): Promise<InsertResult> {
        const insertResult = await this.createQueryBuilder()
            .insert()
            .into(Project)
            .values(project)
            .execute();

        categories.map(async category => {
            category.projectId = insertResult.identifiers[0].id;
            await this.createQueryBuilder()
            .insert()
            .into(Category)
            .values(category)
            .execute();
        })
        userProject.projectId = insertResult.identifiers[0].id;
        await this.createQueryBuilder()
        .insert()
        .into(UserProject)
        .values(userProject)
        .execute();

        return insertResult;
    }

    async findProjectById(id: string) {
        return this.createQueryBuilder('project')
        .where("project.id = :id", { id })
        .leftJoinAndSelect('project.userProject', 'userProject')
        .leftJoinAndSelect('userProject.user', 'usersP')
        .andWhere('invitation = TRUE AND demande = TRUE')
        .leftJoinAndSelect('project.categories', 'categories')
        .leftJoinAndSelect('project.missions', 'missions')
        .leftJoinAndSelect('missions.userMission', 'userMission')
        .leftJoinAndSelect('userMission.user', 'usersM')
        .getOne();
    }

    async createMission(fullMission) {

        const {name, description, picture, projectId, time, users} = fullMission;

        const mission = {name, description, picture, projectId, time};

        const insertResult = await this.createQueryBuilder()
            .insert()
            .into(Mission)
            .values(mission)
            .execute();

        users.map( async (userId) => {
            const userMission = {} as UserMission;
            userMission.userId = userId;
            userMission.missionId = insertResult.identifiers[0].id;
            await this.createQueryBuilder()
            .insert()
            .into(UserMission)
            .values(userMission)
            .execute();
        })
    }

    async findProjectsWithFilters(filters: GetProjectsFilterDto) {
        const {
            title,
            category,
        } = filters;

        const query = this.createQueryBuilder(
            'project'
        )
        .select(`ARRAY_TO_STRING(ARRAY_AGG(categories.name), ',') AS categories, project.*`)
        .innerJoin('project.categories', 'categories')
        .andWhere("project.status = :status", { status: StatusEnum.ENABLED })

        if (title && category) {
            query.andWhere(
                "LOWER(project.title) LIKE LOWER(:title)",
                { title: `%${title}%` },
            )
            .leftJoinAndSelect('project.categories', 'categories2')
            .andWhere("LOWER(categories2.name) LIKE LOWER(:category)", { category: `%${category}%` })
            .groupBy('project.id, categories2.id')
        }
        else if (title) {
            query
            .andWhere(
                "LOWER(project.title) LIKE LOWER(:title)",
                { title: `%${title}%` },
            )
            .groupBy('project.id')
        }

        else if (category) {
            query
            .leftJoinAndSelect('project.categories', 'categories2')
            .andWhere("LOWER(categories2.name) LIKE LOWER(:category)", { category: `%${category}%` })
            .groupBy('project.id, categories2.id')
        }
        else {
            query.groupBy('project.id')
        }

        const projects = await query.getRawMany()

        return projects;
    }

    async isPartner(curentUserId: string, partnerId: string) {
        return await this.query(`SELECT * from user_project WHERE "userId" = '${curentUserId}' and demande = TRUE and invitation = TRUE and "projectId" IN (select "projectId" from user_project WHERE "userId" = '${partnerId}' and demande = TRUE and invitation = TRUE)`)
    }

    async isAdmin (curentUserId: string, projectId: string) {
        return this.createQueryBuilder('project')
        .innerJoinAndSelect('project.userProject', 'userProject')
        .where(`userProject.userId = '${curentUserId}' AND userProject.projectId = '${projectId}' AND (userProject.adminRole = '${AdminRoleEnum.ADMIN}' OR userProject.adminRole = '${AdminRoleEnum.OWNER}')`)
        .getOne()
    }

    async isOwner (curentUserId: string, projectId: string) {
        return this.createQueryBuilder('project')
        .innerJoinAndSelect('project.userProject', 'userProject')
        .where(`userProject.userId = '${curentUserId}' AND userProject.projectId = '${projectId}' AND userProject.adminRole = '${AdminRoleEnum.OWNER}'`)
        .getOne();
    }

    async invite(projectId: string, userId: string, role: string, messageInvitation: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`)
    
        if (found.length) {
            if (!found[0].invitation) {
                if (found[0].demande) {
                    await this.query(`UPDATE user_project SET invitation = TRUE, role = '${role}', "messageInvitation" = ${messageInvitation ? "'" +messageInvitation + "'" : null}, "adminRole" = '${AdminRoleEnum.MEMBER}' WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
                } else {
                    await this.query(`UPDATE user_project SET invitation = TRUE, role = '${role}', "messageInvitation" = ${messageInvitation ? "'" +messageInvitation + "'"  : null} WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
                }
                return 'OK';
            } else {
                return 'OK';
            }
        }

        await this.createQueryBuilder()
        .insert()
        .into(UserProject)
        .values({ userId, projectId, role, messageInvitation: messageInvitation ? messageInvitation : null, invitation: true })
        .execute();

        return 'OK';
    }

    async isNotAUserTreatedGuard (curentUserId: string, projectId: string) {
        const found: UserProject[] = await this.query(`SELECT * FROM user_project WHERE "userId" = '${curentUserId}' AND "projectId" = '${projectId}'`);
        return found;
    }

    async demande(projectId: string, userId: string, messageDemande: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`)
    
        if (found.length) {
            if (!found[0].demande) {
                if (found[0].invitation) {
                    await this.query(`UPDATE user_project SET demande = TRUE, "messageDemande" = ${messageDemande ? "'" + messageDemande + "'" : null}, "adminRole" = '${AdminRoleEnum.MEMBER}' WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
                } else {
                    await this.query(`UPDATE user_project SET demande = TRUE, "messageDemande" = ${messageDemande ? "'" + messageDemande + "'"  : null} WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
                }
                return 'OK';
            } else {
                return 'OK';
            }
        }

        await this.createQueryBuilder()
        .insert()
        .into(UserProject)
        .values({ userId, projectId, messageDemande: messageDemande ? messageDemande : null, demande: true })
        .execute();

        return 'OK';
    }

    async messagingUserNotTreated(projectId: string) {
        return this.createQueryBuilder('project')
        .where("project.id = :id", { id: projectId })
        .leftJoinAndSelect('project.userProject', 'userProject')
        .leftJoinAndSelect('userProject.user', 'users')
        .andWhere('demande = TRUE AND invitation IS NULL')
        .getOne();
    }

    async messagingUserWaiting(projectId: string) {
        return this.createQueryBuilder('project')
        .where("project.id = :id", { id: projectId })
        .leftJoinAndSelect('project.userProject', 'userProject')
        .leftJoinAndSelect('userProject.user', 'users')
        .andWhere('demande IS NULL AND invitation = TRUE')
        .getOne();
    }

    async messagingUserInvitedRefused(projectId: string) {
        return this.createQueryBuilder('project')
        .where("project.id = :id", { id: projectId })
        .leftJoinAndSelect('project.userProject', 'userProject')
        .leftJoinAndSelect('userProject.user', 'users')
        .andWhere('demande = FALSE AND invitation = TRUE')
        .getOne();
    }

    async messagingUserRefused(projectId: string) {
        return this.createQueryBuilder('project')
        .where("project.id = :id", { id: projectId })
        .leftJoinAndSelect('project.userProject', 'userProject')
        .leftJoinAndSelect('userProject.user', 'users')
        .andWhere('invitation = FALSE')
        .getOne();
    }

    async messaging(projectId: string) {
        return this.createQueryBuilder('project')
        .select('project')
        .where("project.id = :id", { id: projectId })
        .getOne();
    }

    async refuse(projectId: string, userId: string) {

        const found = await this.query(`SELECT * FROM user_project WHERE demande = TRUE AND "userId" = '${userId}' AND "projectId" = '${projectId}'`)

        if (found.length) {
            await this.query(`UPDATE user_project SET invitation = FALSE, "adminRole" = NULL, role = NULL WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
            return 'OK';
        }

        return 'NO';
    }

    async reinvite(projectId: string, userId: string, role: string) {

        const found = await this.query(`SELECT * FROM user_project WHERE demande = TRUE AND invitation = FALSE AND "userId" = '${userId}' AND "projectId" = '${projectId}'`)

        if (found.length) {
            await this.query(`UPDATE user_project SET invitation = TRUE, role = '${role}', "adminRole" = '${AdminRoleEnum.MEMBER}'  WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
            return 'OK';
        }

        return 'NO';
    }

    async cancel(projectId: string, userId: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE demande IS NULL AND invitation = TRUE AND "userId" = '${userId}' AND "projectId" = '${projectId}'`);
        if (found.length) {
            await this.query(`DELETE FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
            return 'OK';
        }
        return 'NO';
    }

    async updateProject(
        id: string,
        type: string,
        project: any,
    ) {
        if (type !== 'categories') {
            await this.createQueryBuilder()
                .update(Project)
                .set({[type]: project[type]})
                .where("id = :id", { id })
                .execute();
            return 'OK';
        } 
        await this.query(`DELETE FROM category WHERE "projectId" = '${id}'`);

        project.categories.map(async (cat) => {
            await this.createQueryBuilder()
            .insert()
            .into(Category)
            .values({name: cat, projectId: id})
            .execute();
        })

        return 'OK';
    }

    async isAssigned(curentUserId: string, missionId: string) {
        return this.query(`SELECT * FROM user_mission WHERE "userId" = '${curentUserId}' AND "missionId" = '${missionId}'`);
    }

    async mission(missionId: string) {
        const found = await this.query(`SELECT * FROM mission WHERE id = '${missionId}'`);
        if (!found.length) {
            throw new ConflictException('Mission not found');
        }
        return found[0];
    }

    async findOneMission(missionId: string) {
        return this.query(`SELECT * FROM mission WHERE id = '${missionId}'`);
    }

    async updateMission(
        id: string,
        type: string,
        mission: any,
    ) {
        await this.createQueryBuilder()
            .update(Mission)
            .set({[type]: mission[type]})
            .where("id = :id", { id })
            .execute();
        return 'OK';
    }

    async isAdminFromMissionGuard(userId: string, missionId: string) {
        return this.query(`SELECT * FROM mission INNER JOIN project ON mission."projectId" = project.id INNER JOIN user_project ON project.id = user_project."projectId" WHERE user_project."userId" = '${userId}' AND mission.id = '${missionId}' AND (user_project."adminRole" = '${AdminRoleEnum.ADMIN}' OR user_project."adminRole" = '${AdminRoleEnum.OWNER}')`);
    }

    async missionMember(missionId: string) {
        return this.query(`SELECT * FROM user_mission INNER JOIN "user" ON user_mission."userId" = "user"."id" WHERE user_mission."missionId" = '${missionId}' AND "user".status = '${StatusEnumUser.ENABLED}'`);
    }

    async missionUsersEventually(missionId: string) {
        return this.query(`SELECT * FROM mission INNER JOIN project ON mission."projectId" = project.id INNER JOIN user_project ON project.id = user_project."projectId" INNER JOIN "user" ON user_project."userId" = "user".id WHERE  "mission".id = '${missionId}'`)
    }

    async updateMissionUser(missionId: string, users) {
        await this.query(`DELETE FROM user_mission WHERE "missionId" = '${missionId}'`);

        users.map(async userId => {
            await this.createQueryBuilder()
            .insert()
            .into(UserMission)
            .values({missionId, userId })
            .execute();
        })

        return 'OK';
    }

    async changeRole(projectId: string, userId: string, role: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}' AND role IS NOT NULL AND demande = TRUE`)
        if (found.length && role) {
            this.createQueryBuilder()
                .update(UserProject)
                .set({role})
                .where(`"userId" = '${userId}' AND "projectId" = '${projectId}'`)
                .execute();
                return 'OK'
        }
        throw new ConflictException('something missing');
    }

    async promouvoir(projectId: string, userId: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}' AND "adminRole" = '${AdminRoleEnum.MEMBER}'`);
        if (found.length) {
            this.createQueryBuilder()
                .update(UserProject)
                .set({adminRole: AdminRoleEnum.ADMIN})
                .where(`"userId" = '${userId}' AND "projectId" = '${projectId}'`)
                .execute();
                return 'OK'
        }
        return 'NO';
    }

    async retrograder(projectId: string, userId: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}' AND "adminRole" = '${AdminRoleEnum.ADMIN}'`);
        if (found.length) {
            this.createQueryBuilder()
                .update(UserProject)
                .set({adminRole: AdminRoleEnum.MEMBER})
                .where(`"userId" = '${userId}' AND "projectId" = '${projectId}'`)
                .execute();
                return 'OK'
        }
        return 'NO';
    }
}