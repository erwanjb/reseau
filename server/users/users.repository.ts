import {
    Repository,
    EntityRepository,
    InsertResult,
    UpdateResult,
} from "typeorm";
import { User } from "./users.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUsersFilterDto } from "./dto/get-users-filter.dto";
import { UpdateUserDto } from "./dto/update-user.dto"

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
        user: UpdateUserDto,
    ): Promise<UpdateResult> {
        return this.createQueryBuilder()
            .update(User)
            .set(user)
            .where("id = :id", { id: user.id })
            .execute();
    }

    async findUsersWithFilters(filters: GetUsersFilterDto): Promise<User[]> {
        const {
            search,
            job,
        } = filters;

        const query = this.createQueryBuilder(
            "user",
        ).where("user.status = :status", { status });

        if (search) {
            query.andWhere(
                "user.firstname LIKE :search OR user.lastname LIKE :search",
                { search: `%${search}%` },
            );
        }

        if (job) {
            query.andWhere("user.job LIKE :job", { job: `%${job}%` });
        }

        /* if (location) {
            query.andWhere("user.location = :location", { location });
        } */

        /* if (role) {
            query.andWhere("user.roles like :role", { role: `%${role}%` });
        } */

        const users = await query
            // .leftJoinAndSelect("user.location", "location")
            .getMany();

        return users;
    }
}
