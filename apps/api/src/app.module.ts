import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AppConfigModule, UsersModule],
})
export class AppModule {}
