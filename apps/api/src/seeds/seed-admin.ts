// apps/api/src/seeds/seed-admin.ts
import * as fs from 'fs';
import * as path from 'path';

// Load .env only in local dev (not in Railway/production)
(function loadEnv() {
  const isManaged =
    !!process.env.RAILWAY_ENVIRONMENT ||
    !!process.env.RAILWAY_STATIC_URL ||
    !!process.env.RENDER ||
    !!process.env.VERCEL;
  const isProd = process.env.NODE_ENV === 'production';
  if (isManaged || isProd) return;

  try {
    const dotenv = require('dotenv') as typeof import('dotenv');
    const candidates = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../../.env'),
      path.resolve(__dirname, '../../../../.env'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        break;
      }
    }
  } catch {}
})();

import { clerkClient } from '@clerk/clerk-sdk-node';
import { Logger } from '@nestjs/common';
import dataSource from '../database/data-source';
import { User, UserRole } from '../users/user.entity';

const logger = new Logger('SeedAdmin');

// --- Required envs (throw if missing) ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_IMAGE_URL = process.env.ADMIN_IMAGE_URL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is required.');
}
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD is required.');
}

async function ensureClerkAdmin(): Promise<{ clerkId: string }> {
  // find by email
  const list: any = await clerkClient.users.getUserList({
    emailAddress: [ADMIN_EMAIL],
  });
  const existing = Array.isArray(list)
    ? list[0]
    : Array.isArray(list?.data)
      ? list.data[0]
      : undefined;

  const [firstName, ...rest] = ADMIN_NAME.split(' ').filter(Boolean);
  const lastName = rest.join(' ') || undefined;

  const profile: Record<string, unknown> = {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(ADMIN_IMAGE_URL ? { imageUrl: ADMIN_IMAGE_URL } : {}),
    publicMetadata: { role: 'admin' },
  };

  if (existing) {
    await clerkClient.users.updateUser(existing.id, {
      ...profile,
      password: ADMIN_PASSWORD,
    } as any);
    logger.log(`Updated Clerk admin → ${existing.id}`);
    return { clerkId: existing.id };
  }

  const created = await clerkClient.users.createUser({
    emailAddress: [ADMIN_EMAIL],
    password: ADMIN_PASSWORD,
    ...profile,
  } as any);

  logger.log(`Created Clerk admin → ${created.id}`);
  return { clerkId: created.id };
}

async function ensureDbAdmin(clerkId: string) {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  const repo = dataSource.getRepository(User);

  let user = await repo.findOne({
    where: [{ clerkId }, { email: ADMIN_EMAIL }],
  });

  if (!user) {
    user = repo.create({
      clerkId,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      imageUrl: ADMIN_IMAGE_URL || null,
      role: UserRole.ADMIN,
    });
  } else {
    user.clerkId = clerkId;
    user.email = ADMIN_EMAIL;
    user.name = ADMIN_NAME;
    user.imageUrl = ADMIN_IMAGE_URL || user.imageUrl;
    user.role = UserRole.ADMIN;
  }

  await repo.save(user);
  return user;
}

(async () => {
  try {
    logger.log(`Seeding admin… (${ADMIN_EMAIL})`);
    const { clerkId } = await ensureClerkAdmin();
    const dbUser = await ensureDbAdmin(clerkId);

    logger.log(`✅ Clerk: ${clerkId}`);
    logger.log(`✅ DB   : ${dbUser.id} (role: ${dbUser.role})`);
    logger.warn(`⚠️  Admin password set from ADMIN_PASSWORD env.`);
  } catch (err) {
    logger.error('❌ Seed failed', err as any);
    process.exitCode = 1;
  } finally {
    try {
      if (dataSource.isInitialized) await dataSource.destroy();
    } catch {}
    process.exit();
  }
})();
