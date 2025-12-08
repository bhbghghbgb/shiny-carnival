import { generateManagementRouteConfigs } from '../../utils/routeHelpers';
import { productAdminDefinition } from './definition/products.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const productsRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'products',
  basePath: '/products',
  routes: generateManagementRouteConfigs(productAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(productsRoutes, generatedModule);
