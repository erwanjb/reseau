import {
    Repository,
    EntityRepository,
    InsertResult,
    UpdateResult,
} from "typeorm";
import { Project } from './projects.entity';
import { Category } from "./categories.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UserProject } from "./usersProjects.entity";
import { Mission } from './mission.entity';
import { UserMission } from './usersMissions.entity';

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
}