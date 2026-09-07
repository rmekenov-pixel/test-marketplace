// src/entities/user/model/types.ts

export type Role = 'GUEST' | 'CLIENT' | 'ADMIN' | 'SELLER';
export type UserRole = 'client' | 'admin' | 'guest' | 'seller' | Role;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}
