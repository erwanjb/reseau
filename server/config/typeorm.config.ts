import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../users/users.entity";
import { getMetadataArgsStorage } from 'typeorm';
import { Project } from "../projects/projects.entity";
import { Category } from "../projects/categories.entity";
import { UserMission } from "../projects/usersMissions.entity";
import { UserProject } from "../projects/usersProjects.entity";
import { Mission } from "../projects/mission.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT) || 5432,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [User, Project, Category, UserMission, UserProject, Mission],
    synchronize: true,
};