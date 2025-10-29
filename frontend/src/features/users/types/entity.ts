import type { UserRole } from '../../../config/api';
import type {BaseEntity} from "../../../types/base.entity.ts";

interface User extends BaseEntity{
  id: number;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export type UserNoPass = Omit<User, "password">;
export type UserEntity = User;
