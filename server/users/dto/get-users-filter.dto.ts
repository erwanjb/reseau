import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetUsersFilterDto {
    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsString()
    job: string;
}
