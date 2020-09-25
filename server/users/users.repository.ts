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
        .andWhere('(invitation <> TRUE OR demande <> TRUE)')
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

}
