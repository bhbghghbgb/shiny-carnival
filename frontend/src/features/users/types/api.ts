import type { UserRole } from '../../../config/api';
import type { UserEntity } from './entity.ts';

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface UpdateUserRequest extends UserEntity {
  password?: string; // Gửi chuỗi rỗng nếu không muốn đổi mật khẩu
}
