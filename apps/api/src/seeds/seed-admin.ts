// apps/api/src/seeds/seed-admin.ts
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { clerkClient } from '@clerk/clerk-sdk-node';
import { Logger } from '@nestjs/common';
import { randomInt } from 'crypto';
import dataSource from '../database/data-source';
import { User, UserRole } from '../users/user.entity';

const logger = new Logger('SeedAdmin');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_IMAGE_URL = process.env.ADMIN_IMAGE_URL || '';

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

async function ensureClerkUser() {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is required to run this seeder.');
  }

  const list = await clerkClient.users.getUserList({
    emailAddress: [ADMIN_EMAIL],
  });
  const existing = Array.isArray(list) ? list[0] : undefined;

  const [firstName, ...rest] = ADMIN_NAME.split(' ').filter(Boolean);
  const lastName = rest.join(' ') || undefined;

  if (existing) {
    await clerkClient.users.updateUser(existing.id, {
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(ADMIN_IMAGE_URL ? { imageUrl: ADMIN_IMAGE_URL } : {}),
      publicMetadata: { ...(existing.publicMetadata || {}), role: 'admin' },
    });
    logger.log(`Existing admin found → Clerk ID: ${existing.id}`);
    return { user: existing, password: null as string | null };
  }

  const password = generateStrongPassword();

  const created = await clerkClient.users.createUser({
    emailAddress: [ADMIN_EMAIL],
    password,
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(ADMIN_IMAGE_URL ? { imageUrl: ADMIN_IMAGE_URL } : {}),
    publicMetadata: { role: 'admin' },
  });

  logger.warn('A new admin user has been created in Clerk.');
  logger.warn(`Email: ${ADMIN_EMAIL}`);
  logger.warn(`Temporary Password: ${password}`);
  return { user: created, password };
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

    const { user: clerkUser, password } = await ensureClerkUser();
    const dbUser = await ensureDbUser(clerkUser.id);

    logger.log(`✅ Clerk user: ${clerkUser.id}`);
    logger.log(`✅ DB user   : ${dbUser.id} (role: ${dbUser.role})`);
    if (password)
      logger.warn(`⚠️  Save this admin password securely: ${password}`);
  } catch (err) {
    logger.error('❌ Seed failed', err);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(0);
  }
})();
