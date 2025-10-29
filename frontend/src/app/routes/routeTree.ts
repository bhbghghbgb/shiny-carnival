import { createRoute, createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { homeRoutes } from './modules/home.routes';
import { productsRoutes } from './modules/management/products.routes';
import { usersRoutes } from './modules/management/users.routes';
import { authRoutes } from './modules/auth.routes';
import { categoriesRoutes } from './modules/management/categories.routes';
import { customersRoutes } from './modules/crud/customers.routes';
import { ordersRoutes } from './modules/crud/orders.routes';
import { inventoryRoutes } from './modules/crud/inventory.routes';
import { promotionsRoutes } from './modules/management/promotions.routes';
import { reportsRoutes } from './modules/management/reports.routes';
import { suppliersRoutes } from './modules/management/suppliers.routes';
import type { ModuleRoutes } from './type/types';

// Mảng chứa tất cả các module routes
const allModuleRoutes: ModuleRoutes<any>[] = [
  homeRoutes,
  productsRoutes,
  usersRoutes,
  authRoutes,
  categoriesRoutes,
  customersRoutes,
  ordersRoutes,
  inventoryRoutes,
  promotionsRoutes,
  reportsRoutes,
  suppliersRoutes,
];

// Tạo các route instances từ cấu hình
const moduleRoutes = allModuleRoutes.flatMap(module =>
  module.routes.map((config: { path: any; component: any; searchSchema: any; loader: any; beforeLoad: any; pendingComponent: any; errorComponent: any; }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: config.path,
      component: config.component,
      validateSearch: config.searchSchema,
      loader: config.loader,
      beforeLoad: config.beforeLoad,
      pendingComponent: config.pendingComponent,
      errorComponent: config.errorComponent,
    }),
  ),
);

// Xây dựng cây routing
export const routeTree = rootRoute.addChildren([...moduleRoutes]);

// Khởi tạo router (gộp từ router.ts)
export const router = createRouter({ routeTree });

// Khai báo router cho type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}