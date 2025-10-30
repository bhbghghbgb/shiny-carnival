import { createModuleRoutes, generateManagementRoute } from '../../utils/routeHelpers';
import { reportAdminDefinition } from './definition/reports.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const reportsRoutes: object = {};

const generatedRoutes = createModuleRoutes(
  'reportsAdmin',
  '/admin/reports',
  generateManagementRoute(reportAdminDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(reportsRoutes, generatedRoutes);
