import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition } from '../../../type/types';
import { UserManagementMockPage } from '../../../../../features/users/pages/UserManagementMockPage';
import { users as mockUsers } from '../../../../../_mocks/users';

// 1. Định nghĩa Types và API
// --------------------------

interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
  createdAt: string;
}

interface UserLoaderData {
  users: User[];
  total: number;
}

const userSearchSchema = baseSearchSchema.extend({
  role: z.string().optional(),
  // status: z.enum(['active', 'inactive', 'pending']).optional(),
  // department: z.string().optional(),
});

export type UserSearch = z.infer<typeof userSearchSchema>;

async function fetchUsers(search: UserSearch): Promise<UserLoaderData> {
  console.log('Fetching users with filters:', search);
  // Giả lập gọi API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    users: mockUsers,
    total: mockUsers.length,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const userAdminDefinition: ManagementRouteDefinition<
  UserLoaderData,     // Kiểu loader data
  UserSearch,         // Kiểu search params
  { apiClient: never }  // Kiểu router context (ví dụ)
> = {
  entityName: 'Người dùng',
  path: '/admin/users',
  component: UserManagementMockPage,
  searchSchema: userSearchSchema,
  loader: ({ search }) => fetchUsers(search),
};