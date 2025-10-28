import { createModuleRoutes } from '../../type/types';
import { generateCRUDRoutes } from '../../utils/routeHelpers';
import { inventoryModuleDefinition } from './definition/inventory.definition';

// Bước 1: Export một object tạm thời với kiểu 'any' để phá vỡ sự phụ thuộc vòng tròn
export const inventoryRoutes: any = {};

// Bước 2: Tạo các route thực tế
const generatedRoutes = createModuleRoutes(
  'inventory',
  '/admin/inventory',
  generateCRUDRoutes(inventoryModuleDefinition)
);

// Bước 3: Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(inventoryRoutes, generatedRoutes);
