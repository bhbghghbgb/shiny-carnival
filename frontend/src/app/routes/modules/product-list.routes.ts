import {type ModuleRoutes} from '../type/types';
import {createRouteConfig} from '../utils/routeHelpers';
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
export const productListRoutes: ModuleRoutes = {
    moduleName: 'productList',
    basePath: '/products',
    routes: [
        createRouteConfig({
            path: '/products',
            component: ProductList,
            searchSchema: productSearchSchema,
            meta: {
                title: 'Danh sách Sản phẩm',
                description: 'Xem tất cả sản phẩm có sẵn',
                requiresAuth: false, // Public route
            },
        }),
    ],
};
