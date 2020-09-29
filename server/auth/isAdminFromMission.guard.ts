import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class IsAdminFromMissionGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const user = request.user;
        const userId = user? user.id : null;
        const missionId = request.params.id;

        if (!userId || !missionId) {
            return false;
        }
        const result = await this.projectsService.isAdminFromMissionGuard(userId as string, missionId);
        if (!result.length) {
            return false;
        }
        return true;
    }
}