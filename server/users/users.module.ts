import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UserRepository } from "./users.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { User } from './users.entity'

@Module({
    exports: [UsersService],
    imports: [
        TypeOrmModule.forFeature([UserRepository])
    ],
    controllers: [
        UsersController,],
    providers: [
        UsersService,
    ],
})
export class UsersModule { }
