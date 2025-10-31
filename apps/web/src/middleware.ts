// apps/web/src/middleware.ts
import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isDashboard = createRouteMatcher(['/dashboard(.*)']);
const isAdmin = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Only guard routes that need it
  if (isAdmin(req)) {
    // must be signed in
    await auth.protect();
    const { userId, sessionClaims } = await auth();

    // role from JWT (if you added the JWT template) or fallback to Clerk API
    let role: string | undefined =
      (sessionClaims as any)?.metadata?.role ?? (sessionClaims as any)?.role;

    if (!role && userId) {
      try {
        const client = await clerkClient(); // function-style in your SDK
        const user = await client.users.getUser(userId);
        role = (user.publicMetadata as Record<string, unknown>)?.role as
          | string
          | undefined;
      } catch {
        /* ignore */
      }
    }

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return; // allow admin
  }

  if (isDashboard(req)) {
    // must be signed in
    await auth.protect();
    const { userId, sessionClaims } = await auth();

    // same role resolution
    let role: string | undefined =
      (sessionClaims as any)?.metadata?.role ?? (sessionClaims as any)?.role;

    if (!role && userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        role = (user.publicMetadata as Record<string, unknown>)?.role as
          | string
          | undefined;
      } catch {
        /* ignore */
      }
    }

    // admins shouldn't see /dashboard → send them to /admin
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return; // allow non-admin
  }

  // All other routes are public; do nothing.
});

export const config = {
  matcher: [
    // keep default matcher; we only act on /admin and /dashboard so no loops on /sign-in
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
