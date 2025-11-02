// apps/api/src/database/data-source.ts
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

// Only try .env files in local dev, never in prod/managed
(() => {
  const isManaged =
    !!process.env.RAILWAY_ENVIRONMENT ||
    !!process.env.RAILWAY_STATIC_URL ||
    !!process.env.VERCEL ||
    !!process.env.RENDER;
  const isProd = process.env.NODE_ENV === 'production';
  if (isManaged || isProd) return;

  try {
    const dotenv = require('dotenv') as typeof import('dotenv');
    dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
  } catch {}
})();

function buildConfig() {
  const ext = __filename.endsWith('.ts') ? 'ts' : 'js';

  // Prefer DATABASE_URL on Railway
  const url = process.env.DATABASE_URL;
  if (url) {
    const ssl =
      /sslmode=require/i.test(url) || process.env.PGSSLMODE === 'require'
        ? { rejectUnauthorized: false }
        : undefined;

    return {
      type: 'postgres' as const,
      url,
      ssl,
      entities: [path.join(__dirname, '..', '**', `*.entity.${ext}`)],
      migrations: [path.join(__dirname, 'migrations', `*.${ext}`)],
      synchronize: false,
      logging: process.env.TYPEORM_LOGGING === 'true',
    };
  }

  // Local fallback
  const {
    POSTGRES_HOST = '127.0.0.1',
    POSTGRES_PORT = '5433',
    POSTGRES_USER = 'mvpbase_user',
    POSTGRES_PASSWORD = 'mvpbase_pass',
    POSTGRES_DB = 'mvpbase_db',
  } = process.env;

  return {
    type: 'postgres' as const,
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    entities: [path.join(__dirname, '..', '**', `*.entity.${ext}`)],
    migrations: [path.join(__dirname, 'migrations', `*.${ext}`)],
    synchronize: false,
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}

export default new DataSource(buildConfig());
