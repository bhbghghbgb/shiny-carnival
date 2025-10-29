import { createModuleRoutes, generateManagementRoute } from '../../utils/routeHelpers';
import { categoryAdminDefinition } from './definition/categories.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const categoriesRoutes: object = {};

const generatedRoutes = createModuleRoutes(
  'categoriesAdmin',
  '/admin/categories',
  generateManagementRoute(categoryAdminDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(categoriesRoutes, generatedRoutes);
