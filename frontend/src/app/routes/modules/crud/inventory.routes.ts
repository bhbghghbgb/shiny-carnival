import { generateCRUDRoutes } from '../../utils/routeHelpers';
import { inventoryModuleDefinition } from './definition/inventory.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const inventoryRoutes: any = {};

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'inventory',
  basePath: '/inventory',
  routes: generateCRUDRoutes(inventoryModuleDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(inventoryRoutes, generatedModule);
