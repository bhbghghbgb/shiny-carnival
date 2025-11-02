import { generateCRUDRoutes } from '../../utils/routeHelpers';
import { customerModuleDefinition } from './definition/customers.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const customersRoutes: any = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'customers',
  basePath: '/customers',
  routes: generateCRUDRoutes(customerModuleDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(customersRoutes, generatedModule);
