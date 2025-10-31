import * as dotenv from 'dotenv';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

const {
  POSTGRES_HOST = '127.0.0.1',
  POSTGRES_PORT = '5432',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'postgres',
  POSTGRES_DB = 'app',
} = process.env;

export default new DataSource({
  type: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  // Adjust to your actual entity paths
  entities: [path.resolve(__dirname, '../**/*.entity.{ts,js}')],
  // Migrations live here
  migrations: [path.resolve(__dirname, './migrations/*.{ts,js}')],
  // Helpful in dev; disable in prod
  synchronize: false,
  logging: true,
});
