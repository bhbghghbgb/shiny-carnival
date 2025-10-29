import { createModuleRoutes, generateManagementRoute } from '../../utils/routeHelpers';
import { productAdminDefinition } from './definition/products.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const productsRoutes: object = {};

const generatedRoutes = createModuleRoutes(
  'productsAdmin',
  '/admin/products',
  generateManagementRoute(productAdminDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(productsRoutes, generatedRoutes);
