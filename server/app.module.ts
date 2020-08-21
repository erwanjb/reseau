import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { typeOrmConfig } from "./config/typeorm.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        ProjectsModule, 
        AuthModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule
    ],
    controllers: [AppController]
})
export class AppModule { }
