import { Controller, Post, Get, Req, Res, Param, Put, Query, UseGuards, Body, Request, ConflictException } from '@nestjs/common';
import { ProjectsService } from "./projects.service";
import { IsAdminGuard } from "../auth/isAdmin.guard";
import { AuthGuard } from '@nestjs/passport';
import { IsNotAUserTreatedGuard } from '../auth/isNotAUserTreated.guard';
import { IsOwnerGuard } from '../auth/isOwner.guard';
import { IsOwnProfilGuard } from '../auth/isOwnProfil.guard';
import { IsAssignedGuard } from '../auth/isAssigned.guard';
import { IsAdminFromMissionGuard } from '../auth/isAdminFromMission.guard';
import { IsNotAMemberYetGuard } from '../auth/isNotAMemberYet.guard';
import { IsYetAMemberGuard } from '../auth/isYetAMember.guard';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @UseGuards(AuthGuard('jwt'), IsOwnProfilGuard)
    @Post('/:id')
    create(@Param('id') id: string, @Req() req, @Res() res) {
        return this.projectsService.create(id, req, res);
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
        if (!role) {
            throw new ConflictException('role missing')
        }
        return this.projectsService.invite(id, userId, role, messageInvitation);
    }

    @UseGuards(AuthGuard('jwt'), IsNotAUserTreatedGuard)
    @Post('/demande/:id')
    demande(@Param("id") id: string, @Request() req, @Body('messageDemande') messageDemande: string) {
        return this.projectsService.demande(id, req.user, messageDemande);
    }

    @UseGuards(AuthGuard('jwt'), IsAdminGuard)
    @Get('/messaging/:id')
    messaging(@Param("id") id: string) {
        return this.projectsService.messaging(id);
    }

    @UseGuards(AuthGuard('jwt'), IsAdminGuard, IsNotAMemberYetGuard)
    @Post('/refuse/:id/:userId')
    refuse(@Param("id") id: string, @Param("userId") userId: string) {
        return this.projectsService.refuse(id, userId);
    }

    @UseGuards(AuthGuard('jwt'), IsAdminGuard, IsYetAMemberGuard)
    @Post('/remove/:id/:userId')
    remove(@Param("id") id: string, @Param("userId") userId: string) {
        return this.projectsService.refuse(id, userId);
    }

    @UseGuards(AuthGuard('jwt'), IsOwnerGuard)
    @Post('/promouvoir/:id/:userId')
    promouvoir(@Param("id") id: string, @Param("userId") userId: string) {
        return this.projectsService.promouvoir(id, userId);
    }

    @UseGuards(AuthGuard('jwt'), IsOwnerGuard)
    @Post('/retrograder/:id/:userId')
    retrograder(@Param("id") id: string, @Param("userId") userId: string) {
        return this.projectsService.retrograder(id, userId);
    }

    @UseGuards(AuthGuard('jwt'), IsOwnerGuard)
    @Post('/removeFromOwner/:id/:userId')
    removeFromOwner(@Param("id") id: string, @Param("userId") userId: string) {
        return this.projectsService.refuse(id, userId);
    }    

    @UseGuards(AuthGuard('jwt'), IsAdminGuard)
    @Post('/reinvite/:id/:userId')
    reinvite(@Param("id") id: string, @Param("userId") userId: string, @Body('role') role) {
        if (!role) {
            throw new ConflictException('role missing')
        }
        return this.projectsService.reinvite(id, userId, role);
    }

    @UseGuards(AuthGuard('jwt'), IsAdminGuard)
    @Post('/cancel/:id/:userId')
    cancel(@Param("id") id: string, @Param("userId") userId: string) {
        return this.projectsService.cancel(id, userId);
    }

    @UseGuards(AuthGuard('jwt'), IsOwnerGuard)
    @Put('/:id')
    update(@Param("id") id: string, @Req() req, @Res() res) {
        return this.projectsService.update(id, req, res);
    }

    @UseGuards(AuthGuard('jwt'), IsAssignedGuard)
    @Get('/mission/:id')
    mission(@Param("id") id: string) {
        return this.projectsService.mission(id);
    }
    

    @UseGuards(AuthGuard('jwt'), IsAdminFromMissionGuard)
    @Get('/mission/admin/:id')
    misionAdmin(@Param("id") id: string) {
        return this.projectsService.missionAdmin(id)
    }
    
    @UseGuards(AuthGuard('jwt'), IsAssignedGuard)
    @Put('/mission/:id')
    updateMission(@Param("id") id: string, @Req() req, @Res() res) {
        return this.projectsService.updateMission(id, req, res);
    }

    @UseGuards(AuthGuard('jwt'), IsAdminFromMissionGuard)
    @Put('/missionUser/:id')
    updateMissionUser(@Param("id") id: string, @Req() req, @Res() res) {
        return this.projectsService.updateMissionUser(id, req, res);
    }

    @UseGuards(AuthGuard('jwt'), IsAdminGuard)
    @Post('/changeRole/:id')
    changeRole(@Param('id') id: string, @Body('userId') userId: string,  @Body('role') role: string) {
        return this.projectsService.changeRole(id, userId, role);
    }

}
