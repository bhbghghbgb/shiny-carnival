import { generateManagementRouteConfigs } from '../../utils/routeHelpers';
import { inventoryAdminDefinition } from './definition/inventory.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const inventoryRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'inventory',
  basePath: '/inventory',
  routes: generateManagementRouteConfigs(inventoryAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(inventoryRoutes, generatedModule);
