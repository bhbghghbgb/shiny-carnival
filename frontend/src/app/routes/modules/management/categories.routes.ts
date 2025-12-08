import { generateManagementRouteConfigs } from '../../utils/routeHelpers';
import { categoryAdminDefinition } from './definition/categories.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const categoriesRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'categories',
  basePath: '/categories',
  routes: generateManagementRouteConfigs(categoryAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(categoriesRoutes, generatedModule);
