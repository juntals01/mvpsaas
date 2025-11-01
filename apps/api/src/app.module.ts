import { Module } from '@nestjs/common';
import { SystemModule } from 'src/system/system.module';
import { AppConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AppConfigModule, UsersModule, SystemModule],
})
export class AppModule {}
