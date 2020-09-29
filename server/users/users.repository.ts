import {
    Repository,
    EntityRepository,
    InsertResult,
    UpdateResult,
} from "typeorm";
import { User } from "./users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { StatusEnum } from "./enums/statusEnum";
import { AdminRoleEnum } from '../projects/enums/adminRoleEnum';
import { UserProject } from '../projects/usersProjects.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(user: CreateUserDto): Promise<InsertResult> {
        return this.createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .execute();
    }

    async updateUser(
        id: string,
        type: string,
        user: UpdateUserDto,
    ): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(User)
            .set({[type] :user[type]})
            .where("id = :id", { id })
            .execute();
    }

    async findUserById (id: string) {
        const query = this.createQueryBuilder('user')
        .where("user.id = :id", { id })
        .leftJoinAndSelect('user.projectUser', 'projectUser')
        .andWhere('invitation = TRUE AND demande = TRUE')
        .leftJoinAndSelect('projectUser.project', 'projects')
        const user = await query.getOne();
        /*
            equivaut à const user = await this.findOne({ relations: ["projectUser", "projectUser.project"], where: {id} }) 
        */
        return user;
    }

    async findUserByIdSeconde (id: string) {
        const query = this.createQueryBuilder('user')
        .where("user.id = :id", { id })
        .leftJoinAndSelect('user.projectUser', 'projectUser')
        .andWhere('(invitation <> TRUE OR invitation IS NULL OR demande <> TRUE OR demande IS NULL)')
        .leftJoinAndSelect('projectUser.project', 'projects')
        const user = await query.getOne();
        /*
            equivaut à const user = await this.findOne({ relations: ["projectUser", "projectUser.project"], where: {id} }) 
        */
        return user;
    }

    async findUserByIdFinal (id: string) {
        const query = await this.query(`
            SELECT "user".* FROM "user" full outer join  user_project ON "user"."id" = "userId" full outer join project ON "projectId" = project.id WHERE project.id is null AND "user".id = '${id}'  
        `)
        /*
            equivaut à const user = await this.findOne({ relations: ["projectUser", "projectUser.project"], where: {id} }) 
        */
        return query;
    }

    async findUsersWithFilters(filters: GetUsersFilterDto): Promise<User[]> {
        const {
            search,
            job,
        } = filters;

        const query = this.createQueryBuilder(
            "user",
        )
        .where("user.status = :status", { status: StatusEnum.ENABLED });

        if (job && search) {
            query.andWhere(
                "( LOWER(user.firstName) LIKE LOWER(:search) OR user.lastName LIKE LOWER(:search) OR LOWER(CONCAT(user.lastName, ' ', user.firstName)) LIKE LOWER(:search) OR LOWER(CONCAT(user.firstName, ' ',  user.lastName)) LIKE LOWER(:search) )",
                { search: `%${search}%` }
            )
            .andWhere("LOWER(user.job) LIKE LOWER(:job)", { job: `%${job}%` });
            
        }

        else if (search) {
            query.andWhere(
                "( LOWER(user.firstName) LIKE LOWER(:search) OR user.lastName LIKE LOWER(:search) OR LOWER(CONCAT(user.lastName, ' ', user.firstName)) LIKE LOWER(:search) OR LOWER(CONCAT(user.firstName, ' ',  user.lastName)) LIKE LOWER(:search) )",
                { search: `%${search}%` }
            );
        }
        
        else if (job) {
            query.andWhere("LOWER(user.job) LIKE LOWER(:job)", { job: `%${job}%` });
        }

        /* if (location) {
            query.andWhere("user.location = :location", { location });
        } */

        /* if (role) {
            query.andWhere("user.roles like :role", { role: `%${role}%` });
        } */

        const users = await query
            .getMany();

        return users;
    }

    async messagingProjectNotTreated(userId: string) {
        return this.createQueryBuilder('user')
        .where("user.id = :id", { id: userId })
        .leftJoinAndSelect('user.projectUser', 'projectUser')
        .leftJoinAndSelect('projectUser.project', 'project')
        .leftJoinAndSelect('project.categories', 'categories')
        .andWhere('invitation = TRUE AND demande IS NULL')
        .getOne();
    }

    async messagingProjectRefused(userId: string) {
        return this.createQueryBuilder('user')
        .where("user.id = :id", { id: userId })
        .leftJoinAndSelect('user.projectUser', 'projectUser')
        .leftJoinAndSelect('projectUser.project', 'project')
        .leftJoinAndSelect('project.categories', 'categories')
        .andWhere('demande = FALSE')
        .getOne();
    }

    async messagingProjectWaiting(userId: string) {
        return this.createQueryBuilder('user')
        .where("user.id = :id", { id: userId })
        .leftJoinAndSelect('user.projectUser', 'projectUser')
        .leftJoinAndSelect('projectUser.project', 'project')
        .leftJoinAndSelect('project.categories', 'categories')
        .andWhere('demande = TRUE AND invitation IS NULL')
        .getOne();
    }

    async messagingProjectInvitedRefused(userId: string) {
        return this.createQueryBuilder('user')
        .where("user.id = :id", { id: userId })
        .leftJoinAndSelect('user.projectUser', 'projectUser')
        .leftJoinAndSelect('projectUser.project', 'project')
        .leftJoinAndSelect('project.categories', 'categories')
        .andWhere('demande = TRUE AND invitation = FALSE')
        .getOne();
    }

    async demande(userId: string, projectId: string,  messageDemande: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`)
    
        if (found.length) {
            if (!found[0].demande) {
                if (found[0].invitation) {
                    await this.query(`UPDATE user_project SET demande = TRUE, "messageDemande" = ${messageDemande ? "'" +messageDemande + "'" : null}, "adminRole" = '${AdminRoleEnum.MEMBER}' WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
                } else {
                    await this.query(`UPDATE user_project SET demande = TRUE, "messageDemande" = ${messageDemande ? "'" +messageDemande + "'"  : null} WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
                }
                return 'OK';
            } else {
                return 'OK';
            }
        }

        await this.createQueryBuilder()
        .insert()
        .into(UserProject)
        .values({ userId, projectId,  messageDemande: messageDemande ? messageDemande : null, demande: true })
        .execute();

        return 'OK';
    }

    async refuse(userId: string, projectId: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE demande IS NULL AND invitation = TRUE AND "userId" = '${userId}' AND "projectId" = '${projectId}'`)

        if (found.length) {
            await this.query(`UPDATE user_project SET demande = FALSE WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
            return 'OK';
        }

        return 'NO';
    }

    async redemande(userId: string, projectId: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE demande = FALSE AND invitation = TRUE AND "userId" = '${userId}' AND "projectId" = '${projectId}'`)

        if (found.length) {
            await this.query(`UPDATE user_project SET demande = TRUE, "adminRole" = '${AdminRoleEnum.MEMBER}'  WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
            return 'OK';
        }

        return 'NO';
    }

    async cancel(userId: string, projectId: string) {
        const found = await this.query(`SELECT * FROM user_project WHERE invitation IS NULL AND demande = TRUE AND "userId" = '${userId}' AND "projectId" = '${projectId}'`);
        if (found.length) {
            await this.query(`DELETE FROM user_project WHERE "userId" = '${userId}' AND "projectId" = '${projectId}'`);
            return 'OK';
        }
        return 'NO';
    }

}
