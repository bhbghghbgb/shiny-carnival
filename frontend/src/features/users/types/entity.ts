import type { UserRole } from '../../../config/api';

export interface UserEntity {
  id: number;
  username: string;
  password?: string; // Optional cho update, không trả về trong response
  fullName: string;
  role: UserRole;
  createdAt: string;
}
