import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemState } from './system-state.entity';

@Injectable()
export class SystemStateService {
  constructor(
    @InjectRepository(SystemState) private repo: Repository<SystemState>,
  ) {}

  async set(key: string, value: string) {
    await this.repo.save({ key, value });
  }

  async get(key: string) {
    const row = await this.repo.findOne({ where: { key } });
    return row?.value ?? null;
  }
}
