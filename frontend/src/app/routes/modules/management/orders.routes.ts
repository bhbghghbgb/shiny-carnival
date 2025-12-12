import { generateManagementRouteConfigs } from '../../utils/routeHelpers';
import { orderAdminDefinition } from './definition/orders.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const ordersRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'orders',
  basePath: '/orders',
  routes: generateManagementRouteConfigs(orderAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(ordersRoutes, generatedModule);
