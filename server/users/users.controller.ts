import { Controller, Get, Post, Param, Query, Req, Res, Put, UseGuards } from '@nestjs/common';
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { Request } from "express";
import { AuthGuard } from '@nestjs/passport';
import { IsPartnerGuard } from "../auth/isPartner.guard";
import { IsOwnProfilGuard } from "../auth/isOwnProfil.guard";

interface RequestStorage extends Request {
    verifyEmailIfExist: boolean;
}

@Controller('/users')
export class UsersController { 

    constructor(private readonly userService: UsersService) {}

    @Get("/:id")
    getUserById(@Param("id") id: string): Promise<any> {
        return this.userService.findUserById(id);
    }

    @UseGuards(AuthGuard('jwt'), IsPartnerGuard)
    @Get("/partner/:id")
    getPartnerById(@Param("id") id: string): Promise<any> {
        return this.userService.getPartnerById(id);
    }

    @Post()
    async create(@Req() req, @Res() res) {
        const response = await this.userService.create(req, res);
        return response;
    }

    @UseGuards(AuthGuard('jwt'), IsOwnProfilGuard)
    @Put('/:id')
    async update(@Param("id") id: string, @Req() req, @Res() res) {
        const response = await this.userService.update(id, req, res);
        return response;
    }

    @Get("/filter/search")
    getUsersFilter(@Query('search') search: string, @Query('job') job: string) {
        return this.userService.getUsersFilter(decodeURI(search), decodeURI(job));
    }
}
