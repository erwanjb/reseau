import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from "./users.service";
import { User } from "./users.entity";

@Controller('users')
export class UsersController { 

    constructor(private readonly userService: UsersService) {}

    @Get("/:id")
    getUserById(@Param("id") id: string ): Promise<User> {
        return this.userService.findById(id);
    }
}
