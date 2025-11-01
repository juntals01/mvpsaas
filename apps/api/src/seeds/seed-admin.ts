// apps/api/src/seeds/seed-admin.ts
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// ---- ENV LOADER: dev uses .env if present; prod relies on injected env ----
(function loadEnv() {
  const isManaged = !!(
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_STATIC_URL ||
    process.env.RENDER ||
    process.env.VERCEL
  );
  if (isManaged || process.env.NODE_ENV === 'production') {
    dotenv.config(); // harmless if no file
    return;
  }
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../../.env'),
    path.resolve(__dirname, '../../../../.env'),
    path.resolve(__dirname, '../../../../../.env'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      break;
    }
  }
})();

import { clerkClient } from '@clerk/clerk-sdk-node';
import { Logger } from '@nestjs/common';
import { randomInt } from 'crypto';
import dataSource from '../database/data-source';
import { User, UserRole } from '../users/user.entity';

const logger = new Logger('SeedAdmin');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_IMAGE_URL = process.env.ADMIN_IMAGE_URL || '';
const RESET_INTERVAL_MINUTES = Number(process.env.RESET_INTERVAL_MINUTES || 15);

// Always rotate password (you can gate with env if you want)
const ALWAYS_ROTATE_PASSWORD = true;

/** Generate a strong random password */
function generateStrongPassword(len = 28) {
  const upp = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const low = 'abcdefghijkmnopqrstuvwxyz';
  const num = '0123456789';
  const sym = '!@#$%^&*()-_=+[]{};:,.<>?';
  const all = upp + low + num + sym;

  const pick = (set: string) => set[randomInt(0, set.length)];
  const required = [pick(upp), pick(low), pick(num), pick(sym)];
  const rest = Array.from({ length: Math.max(len - required.length, 0) }, () =>
    pick(all),
  );
  const arr = [...required, ...rest];

  // Fisher–Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/** Create or update the Clerk admin user; always returns the active password */
async function ensureClerkUserAndPassword(): Promise<{
  clerkId: string;
  password: string;
}> {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is required to run this seeder.');
  }

  // Find by email
  const list = await clerkClient.users.getUserList({
    emailAddress: [ADMIN_EMAIL],
  });
  const existing = Array.isArray(list) ? list[0] : undefined;

  const [firstName, ...restName] = ADMIN_NAME.split(' ').filter(Boolean);
  const lastName = restName.join(' ') || undefined;

  // Helper to set profile fields (no-op for missing)
  const baseProfile: Record<string, unknown> = {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(ADMIN_IMAGE_URL ? { imageUrl: ADMIN_IMAGE_URL } : {}),
    publicMetadata: { role: 'admin' },
  };

  // Always set a fresh strong password
  const password = generateStrongPassword();

  if (existing) {
    // Update profile + rotate password
    await clerkClient.users.updateUser(existing.id, {
      ...baseProfile,
      password, // server API can set a new password
    } as any);

    logger.log(`Existing admin updated → Clerk ID: ${existing.id}`);
    return { clerkId: existing.id, password };
  }

  // Create new user
  const created = await clerkClient.users.createUser({
    emailAddress: [ADMIN_EMAIL],
    password,
    ...baseProfile,
  } as any);

  logger.warn('A new admin user has been created in Clerk.');
  return { clerkId: created.id, password };
}

async function ensureDbUser(clerkId: string) {
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
    logger.log('Starting admin seeder...');
    logger.log(`Email: ${ADMIN_EMAIL}`);
    logger.log(`Name : ${ADMIN_NAME}`);

    const { clerkId, password } = await ensureClerkUserAndPassword();
    const dbUser = await ensureDbUser(clerkId);

    logger.log(`✅ Clerk user: ${clerkId}`);
    logger.log(`✅ DB user   : ${dbUser.id} (role: ${dbUser.role})`);

    // Always show the current password (you can gate on NODE_ENV if needed)
    logger.warn(`⚠️  Admin password rotated. Save securely: ${password}`);

    // Optional: set/reset your countdown marks server-side after seeding (if desired)
    // e.g., write to your system_state table or call your /system/reset/mark with interval = RESET_INTERVAL_MINUTES
  } catch (err) {
    logger.error('❌ Seed failed', err);
    process.exitCode = 1;
  } finally {
    try {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    } catch {}
    process.exit();
  }
})();
