import type { ModuleRoutes } from '../type/types';
import { StaffOrderPage } from '../../../features/orders/pages/StaffOrderPage';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { QRScannerPage } from '../../../features/qr-scanner/QRScannerPage';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';
import { createRoleGuard } from '../utils/routeGuards';

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
          errorComponent: ErrorComponent,
          beforeLoad: createRoleGuard(['staff']), // Chỉ Staff được truy cập
          meta: {
            title: 'Tạo đơn hàng',
            description: 'Trang tạo đơn hàng cho nhân viên',
            requiresAuth: true,
          },
        },
        {
          path: 'qr-scanner',
          component: QRScannerPage,
          pendingComponent: PendingComponent,
          errorComponent: ErrorComponent,
          meta: {
            title: 'Scan QR Code',
            description: 'Trang scan QR Code',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
};

