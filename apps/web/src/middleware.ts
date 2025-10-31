// apps/web/src/middleware.ts
import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isDashboard = createRouteMatcher(['/dashboard(.*)']);
const isAdmin = createRouteMatcher(['/admin(.*)']);

type Claims = {
  metadata?: { role?: unknown };
  role?: unknown;
};

function roleFromClaims(sessionClaims: unknown): string | undefined {
  const claims = (sessionClaims ?? null) as Claims | null;
  const candidate = claims?.metadata?.role ?? claims?.role;
  return typeof candidate === 'string' ? candidate : undefined;
}

export default clerkMiddleware(async (auth, req) => {
  // Admin area — require auth + admin role
  if (isAdmin(req)) {
    await auth.protect();
    const { userId, sessionClaims } = await auth();

    let role = roleFromClaims(sessionClaims);

    if (!role && userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const pm = user.publicMetadata as Record<string, unknown> | null;
        const maybeRole = pm?.role;
        if (typeof maybeRole === 'string') role = maybeRole;
      } catch {
        // ignore; role stays undefined
      }
    }

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Dashboard — require auth; if admin, redirect to /admin
  if (isDashboard(req)) {
    await auth.protect();
    const { userId, sessionClaims } = await auth();

    let role = roleFromClaims(sessionClaims);

    if (!role && userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const pm = user.publicMetadata as Record<string, unknown> | null;
        const maybeRole = pm?.role;
        if (typeof maybeRole === 'string') role = maybeRole;
      } catch {
        // ignore
      }
    }

    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Public routes — do nothing
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Act on pages & API routes; ignore static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
