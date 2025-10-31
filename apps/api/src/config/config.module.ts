import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { databaseConfig } from './database.config';
import { envValidationSchema } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), '../../.env.local'),
        resolve(process.cwd(), '../../.env'),
        resolve(process.cwd(), '.env.local'),
        resolve(process.cwd(), '.env'),
      ],
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class AppConfigModule {}
