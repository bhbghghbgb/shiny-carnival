import type { ModuleRoutes } from '../type/types';
import { StaffOrderPage } from '../../../features/orders/pages/StaffOrderPage';
import { PendingComponent } from '../../../components/feedback/PendingComponent';

// Staff module routes configuration with hierarchical structure
export const staffRoutes: ModuleRoutes<any> = {
  moduleName: 'staff',
  basePath: '/staff',
  routes: [
    {
      path: '/staff', // Parent route for grouping
      children: [
        {
          path: 'order',
          component: StaffOrderPage,
          pendingComponent: PendingComponent,
          meta: {
            title: 'Tạo đơn hàng',
            description: 'Trang tạo đơn hàng cho nhân viên',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
};

