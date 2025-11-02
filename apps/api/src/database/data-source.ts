// apps/api/src/database/data-source.ts
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

/** Only load a .env file in *local dev*, never in managed/prod (Railway, Vercel, etc.) */
(() => {
  const isManaged =
    !!process.env.RAILWAY_ENVIRONMENT ||
    !!process.env.RAILWAY_STATIC_URL ||
    !!process.env.VERCEL ||
    !!process.env.RENDER ||
    process.env.NODE_ENV === 'production';

  if (isManaged) return;

  try {
    const dotenv = require('dotenv') as typeof import('dotenv');
    // Try a few likely locations; harmless if missing
    const candidates = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), '../../.env'),
      path.resolve(__dirname, '../../../../.env'),
    ];
    for (const p of candidates) {
      try {
        dotenv.config({ path: p });
        break;
      } catch {}
    }
  } catch {}
})();

function buildConfig() {
  // Prefer DATABASE_URL in prod/managed (Railway injects this)
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
      entities: [
        // works in ts-node and compiled dist
        path.join(__dirname, '..', '**', '*.entity.{ts,js}'),
      ],
      migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
      synchronize: false,
      logging: process.env.TYPEORM_LOGGING === 'true',
    };
  }

  // Local dev fallback (no Railway)
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
    entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
    synchronize: false,
    logging: process.env.TYPEORM_LOGGING === 'true',
  };
}

export default new DataSource(buildConfig());
