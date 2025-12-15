import { generateCRUDRoutesConfigs } from '../../utils/routeHelpers';
import { orderModuleDefinition } from './definition/orders.definition';
import type { ModuleRoutes } from '../../type/types';

// Export một object tạm thời để phá vỡ sự phụ thuộc vòng tròn
export const ordersRoutes: any = {}

// Tạo routes CRUD chuẩn
const crudRoutes = generateCRUDRoutes(orderModuleDefinition)

// Thêm route tracking tùy chỉnh
const trackingRoute: HierarchicalModuleRouteConfig = {
    path: 'orders/$id/tracking',
    component: OrderTrackingPage,
    meta: { title: 'Theo dõi đơn hàng', requiresAuth: true },
}

// Tạo trực tiếp module config.
// basePath giờ đây là tương đối so với layout cha (/admin).
const generatedModule: ModuleRoutes<any> = {
  moduleName: 'orders',
  basePath: '/orders',
  routes: generateCRUDRoutesConfigs(orderModuleDefinition),
};

// Gán các thuộc tính từ config đã tạo vào object tạm thời
Object.assign(ordersRoutes, generatedModule)
