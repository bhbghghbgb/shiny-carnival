import { createModuleRoutes } from '../../utils/routeHelpers';
import { generateCRUDRoutes } from '../../utils/routeHelpers';
import { customerModuleDefinition } from './definition/customers.definition';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const customersRoutes: any = {};

const generatedRoutes = createModuleRoutes(
  'customers',
  '/customers',
  generateCRUDRoutes(customerModuleDefinition)
);

// Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(customersRoutes, generatedRoutes);
