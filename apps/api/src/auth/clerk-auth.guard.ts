// apps/api/src/auth/clerk-auth.guard.ts
import { getAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Optional: attach userId to request for downstream handlers
    (req as any).userId = userId;
    return true;
  }
}
