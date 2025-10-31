// apps/web/src/interfaces/api/user.interface.ts

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id: string;
  clerkId: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  role: UserRole;
  lastSignInAt: string | null;
  createdAt: string;
  updatedAt: string;
}
