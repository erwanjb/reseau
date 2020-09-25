import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const user = request.user;
        const userId = user? user.id : null;
        const projectId = request.params.id;

        if (!userId || !projectId) {
            return false;
        }
        
        const result = await this.projectsService.isAdmin(userId as string, projectId);
        if (result) {
            return true;
        }
        return false;
    }
}