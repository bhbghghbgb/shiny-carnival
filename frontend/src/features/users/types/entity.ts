import type { UserRole } from '../../../config/api';

export interface UserEntity {
  id: number;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  updateAt: Date;
  deleteAt: Date;
  isDelete: boolean;
}
