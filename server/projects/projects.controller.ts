import { Controller, Post, Get, Req, Res, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ProjectsService } from "./projects.service";
import { IsAdminGuard } from "../auth/isAdmin.guard";
import { AuthGuard } from '@nestjs/passport';

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

    @Post('addMission/:id')
    createMission(@Param('id') id: string, @Req() req, @Res() res) {
        return this.projectsService.createMission(id, req, res);
    }

    @Get("/filter/search")
    getUsersFilter(@Query('title') title: string, @Query('category') category: string) {
        return this.projectsService.getprojectsFilter(decodeURI(title), decodeURI(category));
    }
    
    @UseGuards(AuthGuard('jwt'), IsAdminGuard)
    @Post('/invite/:id/:userId')
    invite(@Param("id") id: string, @Param("userId") userId: string, @Body('role') role: string, @Body('messageInvitation') messageInvitation: string) {
        return this.projectsService.invite(id, userId, role, messageInvitation);
    }
}
