import { IsString,IsEmail, IsOptional, IsNumber, IsArray, IsInstance, IsUUID } from "class-validator";

export class UpdateUserDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    job: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsString()
    description: string;

    @IsNumber()
    phone: number
}
