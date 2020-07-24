import { Controller, Get, Post, Param, Body, UseInterceptors, UploadedFile, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor  } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { diskStorage } from "multer";

@Controller('users')
export class UsersController { 

    constructor(private readonly userService: UsersService) {}

    @Get("/:id")
    getUserById(@Param("id") id: string ): Promise<User> {
        return this.userService.findById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('picture', {
        storage: diskStorage({
            destination: "./dist-react/image",
            filename: (req, file, cb) =>
                cb(null, `${Date.now()}_${file.originalname}`),
        }),
        fileFilter: (req, file, cb) => {
            const supportedMimetypes = ["image/jpeg", "image/png"];
            supportedMimetypes.includes(file.mimetype)
                ? cb(null, true)
                : cb(new UnsupportedMediaTypeException(), false);
        },
    }))
    create(@UploadedFile() file, @Body() body) {
        console.log(file, body)
    }
}
