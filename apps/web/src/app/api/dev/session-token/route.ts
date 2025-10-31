// apps/web/src/app/api/dev/session-token/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 });
  }

  const a = await auth(); // ← await the auth() call

  if (!a?.userId || !a?.sessionId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Clerk session JWT for this signed-in user
  const token = await a.getToken(); // ← also await
  if (!token) {
    return new Response('No token available', { status: 400 });
  }

  return NextResponse.json({
    note: 'Copy the value below into Swagger → Authorize',
    bearer: `Bearer ${token}`,
  });
}
