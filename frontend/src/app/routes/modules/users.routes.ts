import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import { UserManagementMockPage } from '../../../features/users/pages/UserManagementMockPage';

// Extended search schema for users
const userSearchSchema = baseSearchSchema.extend({
  role: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  department: z.string().optional(),
});

export type UserSearch = z.infer<typeof userSearchSchema>;

// Users module routes configuration
export const usersRoutes: ModuleRoutes = {
  moduleName: 'users',
  basePath: '/admin/users',
  routes: createAdminRoutes(
    'Người dùng',
    '/admin/users',
    UserManagementMockPage,
    {
      searchSchema: userSearchSchema,
      requiresAuth: true,
    }
  ),
};
