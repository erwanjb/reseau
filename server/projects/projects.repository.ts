import {
    Repository,
    EntityRepository,
    InsertResult,
    UpdateResult,
    Raw
} from "typeorm";
import { Project } from './projects.entity';
import { Category } from "./categories.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import {GetProjectsFilterDto} from "./dto/get-projects-filter.dto";
import { UserProject } from "./usersProjects.entity";
import { Mission } from './mission.entity';
import { UserMission } from './usersMissions.entity';
import { StatusEnum } from "./enums/statusEnum";
import { AdminRoleEnum } from "./enums/adminRoleEnum";

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
}