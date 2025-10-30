import { createModuleRoutes } from '../../utils/routeHelpers';
import { generateCRUDRoutes } from '../../utils/routeHelpers';
import { orderModuleDefinition } from './definition/orders.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const ordersRoutes: any = {};

const generatedRoutes = createModuleRoutes(
  'orders',
  '/orders',
  generateCRUDRoutes(orderModuleDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(ordersRoutes, generatedRoutes);
