import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../users/users.entity";
import { getMetadataArgsStorage } from 'typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT) || 3306,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
    synchronize: true,
};