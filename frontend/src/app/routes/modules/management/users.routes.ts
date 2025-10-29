import { createModuleRoutes, generateManagementRoute } from '../../utils/routeHelpers';
import { userAdminDefinition } from './definition/users.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const usersRoutes: object = {};

const generatedRoutes = createModuleRoutes(
  'users',
  '/admin/users',
  generateManagementRoute(userAdminDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(usersRoutes, generatedRoutes);
