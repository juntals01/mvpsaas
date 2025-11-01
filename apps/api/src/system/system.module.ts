import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemState } from './system-state.entity';
import { SystemStateService } from './system-state.service';
import { SystemController } from './system.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemState])],
  controllers: [SystemController],
  providers: [SystemStateService],
  exports: [SystemStateService],
})
export class SystemModule {}
