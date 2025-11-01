import { generateManagementRoute } from '../../utils/routeHelpers';
import { reportAdminDefinition } from './definition/reports.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const reportsRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'reports',
  basePath: '/reports',
  routes: generateManagementRoute(reportAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(reportsRoutes, generatedModule);
