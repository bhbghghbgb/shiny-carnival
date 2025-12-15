// TODO: File này cần được refactor để sử dụng generateManagementRoute hoặc generateCRUDRoutes
// Tạm thời comment để tránh lỗi build

import { type LegacyModuleRoutes } from '../type/types';
// import { createRouteConfig } from '../utils/routeHelpers'; // Function không tồn tại
import ProductList from '../../../features/products/pages/ProductList';
import { z } from 'zod';

// Schema để xác thực search params cho trang sản phẩm
const productSearchSchema = z.object({
    page: z.number().catch(1), // Mặc định là trang 1 nếu không có
    pageSize: z.number().catch(10), // Mặc định 10 sản phẩm mỗi trang
    search: z.string().optional(),
    // Thêm các filter khác nếu cần
});

// Suy ra kiểu từ schema để sử dụng trong loader
type TProductSearch = z.infer<typeof productSearchSchema>;

// Product list route for public view
// TODO: Refactor to use new route generation system
export const productListRoutes: LegacyModuleRoutes = {
    moduleName: 'productList',
    basePath: '/products',
    routes: [
        // Tạm thời comment để tránh lỗi build
        // createRouteConfig({
        //     path: '/products',
        //     component: ProductList,
        //     searchSchema: productSearchSchema,
        //     meta: {
        //         title: 'Danh sách Sản phẩm',
        //         description: 'Xem tất cả sản phẩm có sẵn',
        //         requiresAuth: false, // Public route
        //     },
        // }),
    ],
};
