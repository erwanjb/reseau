import { IsEmail, IsEnum, IsNumber, IsString, IsOptional, IsInt } from "class-validator";
import { StatusEnum } from "../enums/statusEnum";

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsEnum(StatusEnum)
    status: StatusEnum;

    @IsString()
    picture?: string;

    @IsString()
    description: string;

    @IsInt()
    time: number
}