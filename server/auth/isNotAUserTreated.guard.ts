import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class IsNotAUserTreatedGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const user = request.user;
        const userId = user ? user.id : null;
        const projectId = request.params.id;

        if (!userId || !projectId) {
            return false;
        }
        
        const found = await this.projectsService.isNotAUserTreatedGuard(userId as string, projectId);
        if (!found.length) {
            return true;
        }
        if (!found[0].demande && found[0].demande !== false && found[0].invitation !== false) {
            return true;
        }
        return false;
    }
}