import { generateManagementRoute } from '../../utils/routeHelpers';
import { supplierAdminDefinition } from './definition/suppliers.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const suppliersRoutes: object = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'suppliers',
  basePath: '/suppliers',
  routes: generateManagementRoute(supplierAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(suppliersRoutes, generatedModule);
