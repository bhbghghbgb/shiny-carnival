import type { ModuleRoutes } from '../type/types';
import { QRScannerPage } from '../../../features/qr-scanner/QRScannerPage';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';

// QR Scanner module routes configuration with hierarchical structure
export const qrScannerRoutes: ModuleRoutes<any> = {
    moduleName: 'qr-scanner',
    basePath: '/qr-scanner',
    routes: [
        {
            path: 'qr-scanner',
            component: QRScannerPage,
            pendingComponent: PendingComponent,
            errorComponent: ErrorComponent,
            meta: {
                requiresAuth: false,
                title: 'Quét mã QR',
                description: 'Quét mã QR để tìm kiếm sản phẩm',
            },
        },
    ],
};
