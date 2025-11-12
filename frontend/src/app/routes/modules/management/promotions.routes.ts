import { generateManagementRouteConfigs } from '../../utils/routeHelpers';
import { promotionAdminDefinition } from './definition/promotions.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const promotionsRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'promotions',
  basePath: '/promotions',
  routes: generateManagementRouteConfigs(promotionAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(promotionsRoutes, generatedModule);
