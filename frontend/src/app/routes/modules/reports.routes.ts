import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createAdminRoutes } from '../utils/routeHelpers';
import { ReportManagementPage } from '../../../features/reports/pages/ReportManagementPage';

// Extended search schema for reports
const reportSearchSchema = baseSearchSchema.extend({
  reportType: z.enum(['sales', 'inventory', 'customer']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ReportSearch = z.infer<typeof reportSearchSchema>;

// Reports module admin routes configuration
export const reportsRoutes: ModuleRoutes = {
  moduleName: 'reportsAdmin',
  basePath: '/admin/reports',
  routes: createAdminRoutes(
    'Báo cáo',
    '/admin/reports',
    ReportManagementPage,
    {
      searchSchema: reportSearchSchema,
      requiresAuth: true,
    }
  ),
};
