import { Controller, Post, Get, Req, Res, Param } from '@nestjs/common';
import { ProjectsService } from "./projects.service";

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @Post()
    create(@Req() req, @Res() res) {
        return this.projectsService.create(req, res);
    }

    @Get('/:id')
    getProjectById(@Param("id") id: string ): Promise<any> {
        return this.projectsService.findProjectById(id);
    }

    @Post('addMission')
    createMission(@Req() req, @Res() res) {
        return this.projectsService.createMission(req, res);
    }
}
