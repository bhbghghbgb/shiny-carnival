import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import { CategoryManagementPage } from '../../../features/categories/pages/CategoryManagementPage';

// Extended search schema for categories
const categorySearchSchema = baseSearchSchema.extend({
  parentId: z.string().optional(),
  level: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type CategorySearch = z.infer<typeof categorySearchSchema>;

// Categories module admin routes configuration
export const categoriesRoutes: ModuleRoutes = {
  moduleName: 'categoriesAdmin',
  basePath: '/admin/categories',
  routes: createAdminRoutes(
    'Danh mục',
    '/admin/categories',
    CategoryManagementPage,
    {
      searchSchema: categorySearchSchema,
      requiresAuth: true,
    }
  ),
};
