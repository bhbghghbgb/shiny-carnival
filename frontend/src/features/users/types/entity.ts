import type { UserRole } from '../../../config/api.config.ts';
import type { BaseEntity } from "../../../types/base.entity.ts";

interface User extends BaseEntity {
  id: number;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export type UserNoPass = Omit<User, "password">;
export type UserEntity = User;

// User Details DTO - từ backend UserResponseDto
export interface UserDetailsDto {
    id: number;
    username: string;
    fullName: string;
    role: UserRole;
    totalOrders: number;
    createdAt: string | Date; // Backend trả về string, nhưng có thể convert sang Date
}
