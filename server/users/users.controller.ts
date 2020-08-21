import { Controller, Get, Post, Param, Query, Req, Res } from '@nestjs/common';
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { Request } from "express";

interface RequestStorage extends Request {
    verifyEmailIfExist: boolean;
}

@Controller('users')
export class UsersController { 

    constructor(private readonly userService: UsersService) {}

    @Get("/:id")
    getUserById(@Param("id") id: string ): Promise<any> {
        return this.userService.findUserById(id);
    }

    @Post()
    async create(@Req() req, @Res() res) {
        const response = await this.userService.create(req, res);
        return response;
    }
}
