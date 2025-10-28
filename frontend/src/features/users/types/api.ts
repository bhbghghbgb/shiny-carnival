import type { UserRole } from '../../../config/api';
import type { UserEntity } from './entity.ts';

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export type UpdateUserRequest = UserEntity;
