import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import { InventoryManagementPage } from '../../../features/inventory/pages/InventoryManagementPage';

// Extended search schema for inventory
const inventorySearchSchema = baseSearchSchema.extend({
  warehouseId: z.string().optional(),
  productId: z.string().optional(),
  minQuantity: z.number().optional(),
  maxQuantity: z.number().optional(),
});

export type InventorySearch = z.infer<typeof inventorySearchSchema>;

// Inventory module admin routes configuration
export const inventoryRoutes: ModuleRoutes = {
  moduleName: 'inventoryAdmin',
  basePath: '/admin/inventory',
  routes: createAdminRoutes(
    'Kho hàng',
    '/admin/inventory',
    InventoryManagementPage,
    {
      searchSchema: inventorySearchSchema,
      requiresAuth: true,
    }
  ),
};
