import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import { PromotionManagementPage } from '../../../features/promotions/pages/PromotionManagementPage';

// Extended search schema for promotions
const promotionSearchSchema = baseSearchSchema.extend({
  type: z.enum(['discount', 'coupon', 'special_offer']).optional(),
  status: z.enum(['active', 'expired', 'scheduled']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type PromotionSearch = z.infer<typeof promotionSearchSchema>;

// Promotions module admin routes configuration
export const promotionsRoutes: ModuleRoutes = {
  moduleName: 'promotionsAdmin',
  basePath: '/admin/promotions',
  routes: createAdminRoutes(
    'Khuyến mãi',
    '/admin/promotions',
    PromotionManagementPage,
    {
      searchSchema: promotionSearchSchema,
      requiresAuth: true,
    }
  ),
};
