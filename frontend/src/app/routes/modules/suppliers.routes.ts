import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import  SupplierManagementPage  from '../../../features/suppliers/pages/SupplierManagementPage';

// Extended search schema for suppliers
const supplierSearchSchema = baseSearchSchema.extend({
  country: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  isVerified: z.boolean().optional(),
});

export type SupplierSearch = z.infer<typeof supplierSearchSchema>;

// Suppliers module admin routes configuration
export const suppliersRoutes: ModuleRoutes = {
  moduleName: 'suppliersAdmin',
  basePath: '/admin/suppliers',
  routes: createAdminRoutes(
    'Nhà cung cấp',
    '/admin/suppliers',
    SupplierManagementPage,
    {
      searchSchema: supplierSearchSchema,
      requiresAuth: true,
    }
  ),
};
