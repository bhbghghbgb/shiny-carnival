import type { UserRole } from '../../../config/api.config.ts';
import type { UserEntity } from './entity.ts';

export interface CreateUserRequest {
  username: string;    // Required, max 50 chars
  password: string;    // Required, min 6 chars
  fullName: string;    // Required, max 100 chars
  role: UserRole;       // Required, 0: Admin, 1: Staff
}

export interface UpdateUserRequest {
  id: number;                // Required, integer
  username: string;          // Required, min 1, max 50 chars
  password?: string | null;   // Optional, nullable, max 255 chars - null = không đổi password
  fullName: string;          // Required, min 1, max 100 chars
  role: UserRole;            // Required, 0 (Admin) or 1 (Staff)
}
