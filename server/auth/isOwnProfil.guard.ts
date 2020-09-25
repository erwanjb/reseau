import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class IsOwnProfilGuard implements CanActivate {
  constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userId = user ? user.id : null;
        const compareId = request.params.id;

        if (!userId || !compareId) {
            return false;
        }
        
        if (userId === compareId) {
            return true;
        }
        return false;
    }
}