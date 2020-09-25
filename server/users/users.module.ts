import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { User } from './users.entity';
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from '@nestjs/jwt';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    exports: [UsersService],
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { /* expiresIn: '60s' */ },
        }),
        ProjectsModule
    ],
    controllers: [
        UsersController,],
    providers: [
        UsersService,
    ],
})
export class UsersModule { }
