import { createModuleRoutes, generateManagementRoute } from '../../utils/routeHelpers';
import { supplierAdminDefinition } from './definition/suppliers.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const suppliersRoutes: object = {};

const generatedRoutes = createModuleRoutes(
  'suppliersAdmin',
  '/admin/suppliers',
  generateManagementRoute(supplierAdminDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(suppliersRoutes, generatedRoutes);
