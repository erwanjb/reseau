import { IsEmail, IsEnum, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

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
    phone: number

    /* @IsEnum(UserStatus)
    status: UserStatus; */

}
