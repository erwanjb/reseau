import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Module } from '@nestjs/common';
import { ProjectRepository } from "./projects.repository";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    exports: [ProjectsService],
    imports: [TypeOrmModule.forFeature([ProjectRepository])],
    controllers: [
        ProjectsController,],
    providers: [
        ProjectsService, ],
})
export class ProjectsModule { }
