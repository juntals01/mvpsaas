// apps/api/src/auth/current-auth.decorator.ts
import { getAuth } from '@clerk/express';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export interface CurrentAuth {
  userId: string;
  sessionId: string;
  orgId?: string | null;
  claims?: Record<string, unknown>;
  email: string | null;
}

function extractEmail(claims: any): string | null {
  if (claims?.email) return claims.email;
  if (claims?.primary_email_address?.email_address)
    return claims.primary_email_address.email_address;
  if (Array.isArray(claims?.email_addresses) && claims.email_addresses.length) {
    return claims.email_addresses[0].email_address;
  }
  if (claims?.email_address) return claims.email_address;
  return null;
}

export const CurrentAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentAuth => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const a = getAuth(req);

    if (!a?.userId || !a?.sessionId)
      throw new UnauthorizedException('Unauthorized');

    const claims: any = (a as any).sessionClaims ?? {};
    const email = extractEmail(claims);

    // ❗ Only fail if *no* userId and *no* fallback email
    if (!email) {
      // still let it through — optional
      console.warn('⚠️ Clerk token missing email claim for user', a.userId);
    }

    return {
      userId: a.userId,
      sessionId: a.sessionId,
      orgId: (a as any).orgId ?? null,
      claims,
      email: email ?? null,
    };
  },
);
