import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import { ProductManagementMockPage } from '../../../features/products/pages/ProductManagementMockPage';

// Extended search schema for products
const productSearchSchema = baseSearchSchema.extend({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

// Products module admin routes configuration
export const productsRoutes: ModuleRoutes = {
  moduleName: 'productsAdmin',
  basePath: '/admin/products',
  routes: createAdminRoutes(
    'Sản phẩm',
    '/admin/products',
    ProductManagementMockPage,
    {
      searchSchema: productSearchSchema,
      requiresAuth: true,
    }
  ),
};
