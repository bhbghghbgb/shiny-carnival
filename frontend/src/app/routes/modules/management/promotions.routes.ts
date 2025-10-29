import { createModuleRoutes, generateManagementRoute } from '../../utils/routeHelpers';
import { promotionAdminDefinition } from './definition/promotions.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const promotionsRoutes: object = {};

const generatedRoutes = createModuleRoutes(
  'promotionsAdmin',
  '/admin/promotions',
  generateManagementRoute(promotionAdminDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(promotionsRoutes, generatedRoutes);
