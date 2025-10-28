import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createCRUDRoutes, createRouteConfig } from '../utils/routeHelpers';
import { OrderListPage } from '../../../features/orders/pages/OrderListPage';
import { OrderDetailPage } from '../../../features/orders/pages/OrderDetailPage';
import { OrderCreatePage } from '../../../features/orders/pages/OrderCreatePage';
import { OrderEditPage } from '../../../features/orders/pages/OrderEditPage';
import { OrderTrackingPage } from '../../../features/orders/pages/OrderTrackingPage';

// Extended search schema cho orders
const orderSearchSchema = baseSearchSchema.extend({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  customerId: z.string().optional(),
  orderDateFrom: z.string().optional(),
  orderDateTo: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});

export type OrderSearch = z.infer<typeof orderSearchSchema>;

// Orders module routes configuration
export const ordersRoutes: ModuleRoutes = {
  moduleName: 'orders',
  basePath: '/orders',
  routes: [
    ...createCRUDRoutes(
      'đơn hàng',
      '/orders',
      {
        list: OrderListPage,
        detail: OrderDetailPage,
        create: OrderCreatePage,
        edit: OrderEditPage,
      },
      {
        searchSchema: orderSearchSchema,
        requiresAuth: true,
      }
    ),
    // Additional tracking route
    // createRouteConfig({
    //   path: '/orders/$orderId/tracking',
    //   component: OrderTrackingPage,
    //   meta: {
    //     title: 'Theo dõi đơn hàng',
    //     description: 'Trang theo dõi trạng thái đơn hàng',
    //     requiresAuth: false,
    //   },
    // }),
  ],
};
