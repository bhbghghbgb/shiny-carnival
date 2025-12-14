// frontend/src/app/routes/routeTree.ts
import { createRoute, createRouter, type AnyRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { queryClient } from '../../lib/query/queryClient';
import { authLayoutRoute } from './layout/auth.layout';
import { mainLayoutRoute } from './layout/main.layout';
import { createAdminLayoutRoute } from './layout/admin.layout';
import { createStaffLayoutRoute } from './layout/staff.layout';
import { homeRoutes } from './modules/home.routes';
import { authRoutes } from './modules/auth.routes';
import { qrScannerRoutes } from './modules/qr-scanner.routes';
import { staffRoutes } from './modules/staff.routes';
// ... import các module routes khác như trong file gốc
import { productsRoutes } from './modules/management/products.routes';
import { usersRoutes } from './modules/management/users.routes';
import { categoriesRoutes } from './modules/management/categories.routes';
import { customersRoutes } from './modules/management/customers.routes';
import { ordersRoutes } from './modules/management/orders.routes';
import { inventoryRoutes } from './modules/management/inventory.routes';
import { promotionsRoutes } from './modules/management/promotions.routes';
import { reportsRoutes } from './modules/management/reports.routes';
import { suppliersRoutes } from './modules/management/suppliers.routes';
import type { ModuleRoutes, HierarchicalModuleRouteConfig } from './type/types';


/**
 * Hàm đệ quy để xây dựng cây route từ cấu trúc config phân cấp.
 * @param configs - Mảng các config ở cấp hiện tại.
 * @param parentRoute - Route object cha để gắn các route mới vào.
 * @returns Một mảng các Route object đã được tạo.
 */
function buildRoutesFromConfig(
  configs: HierarchicalModuleRouteConfig[],
  parentRoute: AnyRoute,
): AnyRoute[] {
  return configs.map(config => {
    // Tạo route hiện tại từ config
    const newRoute = createRoute({
      getParentRoute: () => parentRoute,
      path: config.path,
      component: config.component,
      validateSearch: config.searchSchema,
      loaderDeps: config.searchSchema ? ({ search }) => ({ search }) : undefined,
      loader: config.loader
        ? ({ params, deps, context, abortController, preload }) =>
          config.loader!({
            params,
            search: (deps as any)?.search,
            context: context as any,
            abortController,
            preload,
          })
        : undefined,
      beforeLoad: config.beforeLoad,
      pendingComponent: config.pendingComponent,
      errorComponent: config.errorComponent,
      // ... các thuộc tính khác từ config
    });

    // Nếu config này có con, gọi đệ quy để tạo các route con
    if (config.children && config.children.length > 0) {
      const childRoutes = buildRoutesFromConfig(config.children, newRoute);
      // Gắn các route con vừa tạo vào route cha của chúng
      newRoute.addChildren(childRoutes);
    }

    return newRoute;
  });
}

// --- Logic chính ---

// Auth routes (không có sidebar)
const authModuleRoutes: ModuleRoutes<any>[] = [
  authRoutes,
];



// Admin routes (có sidebar)
const adminModuleRoutes: ModuleRoutes<any>[] = [
  productsRoutes,
  usersRoutes,
  categoriesRoutes,
  customersRoutes,
  ordersRoutes,
  inventoryRoutes,
  promotionsRoutes,
  reportsRoutes,
  suppliersRoutes,
];

// Staff routes (có sidebar)
const staffModuleRoutes: ModuleRoutes<any>[] = [
  staffRoutes,
];

// Build auth routes với authLayoutRoute (không có sidebar)
// Lưu ý: authLayoutRoute đã có path '/auth', nên chỉ build các children routes
const authRoutesConfig = authModuleRoutes.flatMap(m => m.routes as HierarchicalModuleRouteConfig[]);
const authRoutesBuilt = authRoutesConfig.flatMap(config => {
  // Nếu config có children, build trực tiếp các children với authLayoutRoute
  if (config.children && config.children.length > 0) {
    return buildRoutesFromConfig(config.children, authLayoutRoute);
  }
  // Nếu không có children, build route chính
  return buildRoutesFromConfig([config], authLayoutRoute);
});

// Tạo adminLayoutRoute với mainLayoutRoute làm parent để đảm bảo sidebar hiển thị
const adminLayoutRoute = createAdminLayoutRoute(mainLayoutRoute);

// Build admin routes với adminLayoutRoute
const adminRoutes = buildRoutesFromConfig(
  adminModuleRoutes.flatMap(m => m.routes as HierarchicalModuleRouteConfig[]),
  adminLayoutRoute,
);

// 3. Gắn các route auth đã tạo vào authLayoutRoute
authLayoutRoute.addChildren(authRoutesBuilt);

// 4. Gắn các route home đã tạo vào mainLayoutRoute
mainLayoutRoute.addChildren(homeRoutesBuilt);

// 5. Gắn các route admin đã tạo vào adminLayoutRoute
adminLayoutRoute.addChildren(adminRoutes);

// Tạo staffLayoutRoute với mainLayoutRoute làm parent để đảm bảo sidebar hiển thị
const staffLayoutRoute = createStaffLayoutRoute(mainLayoutRoute);

// Build staff routes với staffLayoutRoute
const staffRoutesConfig = staffModuleRoutes.flatMap(m => m.routes as HierarchicalModuleRouteConfig[]);
const staffRoutesBuilt = staffRoutesConfig.flatMap(config => {
  // Nếu config có children, build trực tiếp các children với staffLayoutRoute
  if (config.children && config.children.length > 0) {
    return buildRoutesFromConfig(config.children, staffLayoutRoute);
  }
  // Nếu không có children, build route chính
  return buildRoutesFromConfig([config], staffLayoutRoute);
});

// Gắn các route staff đã tạo vào staffLayoutRoute
staffLayoutRoute.addChildren(staffRoutesBuilt);

// 6. Gắn adminLayoutRoute và staffLayoutRoute vào mainLayoutRoute để có sidebar
mainLayoutRoute.addChildren([adminLayoutRoute, staffLayoutRoute]);

// 7. Xây dựng cây routing cuối cùng
const routeTree = rootRoute.addChildren([
  authLayoutRoute, // Auth layout (không có sidebar)
  mainLayoutRoute, // Main layout (có sidebar) - chứa home và admin routes
]);

// 5. Khởi tạo router với context
export const router = createRouter({
  routeTree,
  context: () => ({
    queryClient: queryClient,
  }),
});

// 6. Khai báo router cho type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}