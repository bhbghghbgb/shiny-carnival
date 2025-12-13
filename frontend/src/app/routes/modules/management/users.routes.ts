import { generateManagementRouteConfigs } from '../../utils/routeHelpers';
import { userAdminDefinition } from './definition/users.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const usersRoutes: object = {};

// Tạo trực tiếp module config vì hàm createModuleRoutes đã được loại bỏ.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'users',
  basePath: '/users',
  routes: generateManagementRouteConfigs(userAdminDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(usersRoutes, generatedModule);
