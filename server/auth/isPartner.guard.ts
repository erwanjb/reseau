import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class IsPartnerGuard implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const user = request.user;
        const userId = user? user.id : null;
        const userPartnerId = request.params.id;

        if (!userId || !userPartnerId) {
            return false;
        }
        
        const result = await this.projectsService.isPartner(userId as string, userPartnerId);
        if (result.length) {
            return true;
        }
        return false;
    }
}