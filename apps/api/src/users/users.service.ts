// apps/api/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  findByClerkId(clerkId: string) {
    return this.repo.findOne({ where: { clerkId } });
  }

  async findOrCreateFromClerk(params: {
    clerkId: string;
    email?: string | null;
    name?: string | null;
    imageUrl?: string | null;
    lastSignInAt?: Date | null;
  }) {
    const {
      clerkId,
      email = null,
      name = null,
      imageUrl = null,
      lastSignInAt = null,
    } = params;

    let user = await this.findByClerkId(clerkId);
    if (user) {
      user.email = email;
      user.name = name;
      user.imageUrl = imageUrl;
      user.lastSignInAt = lastSignInAt;
      return this.repo.save(user);
    }

    user = this.repo.create({
      clerkId,
      email,
      name,
      imageUrl,
      lastSignInAt,
      role: UserRole.USER,
    });
    return this.repo.save(user);
  }
}
