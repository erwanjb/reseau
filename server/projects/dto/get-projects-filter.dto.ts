import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetProjectsFilterDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    category: string;
}