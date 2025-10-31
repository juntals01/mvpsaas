// apps/api/src/users/users.controller.ts
import { clerkClient, getAuth } from '@clerk/express';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async me(@Req() req: Request) {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId as string);

    const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;
    const name =
      `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null;
    const imageUrl = clerkUser.imageUrl ?? null;

    const user = await this.users.findOrCreateFromClerk({
      clerkId: userId as string,
      email,
      name,
      imageUrl,
      lastSignInAt: new Date(),
    });

    return { ok: true, user };
  }
}
