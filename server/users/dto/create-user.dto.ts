import { IsEmail, IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { StatusEnum } from "../enums/statusEnum";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(StatusEnum)
    status: StatusEnum;

    @IsString()
    confirmToken: string; 

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    picture?: string;

    @IsString()
    job: string;

    @IsString()
    description: string;

    @IsNumber()
    phone: string

    /* @IsEnum(UserStatus)
    status: UserStatus; */

}
