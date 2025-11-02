// frontend/src/app/routes/routeTree.ts
import { createRoute, createRouter, type AnyRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { adminLayoutRoute } from './modules/layout/admin.layout';
import { homeRoutes } from './modules/home.routes';
import { authRoutes } from './modules/auth.routes';
// ... import các module routes khác như trong file gốc
import { productsRoutes } from './modules/management/products.routes';
import { usersRoutes } from './modules/management/users.routes';
import { categoriesRoutes } from './modules/management/categories.routes';
import { customersRoutes } from './modules/crud/customers.routes';
import { ordersRoutes } from './modules/crud/orders.routes';
import { inventoryRoutes } from './modules/crud/inventory.routes';
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

// 1. Gom nhóm các module routes như kế hoạch ban đầu
const standaloneModuleRoutes: ModuleRoutes<any>[] = [
  homeRoutes,
  authRoutes,
];

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

// 2. Sử dụng hàm đệ quy để tạo các route instances
const standaloneRoutes = buildRoutesFromConfig(
  standaloneModuleRoutes.flatMap(m => m.routes as HierarchicalModuleRouteConfig[]),
  rootRoute,
);

const adminRoutes = buildRoutesFromConfig(
  adminModuleRoutes.flatMap(m => m.routes as HierarchicalModuleRouteConfig[]),
  adminLayoutRoute,
);

// 3. Gắn các route admin đã tạo vào layout của chúng
adminLayoutRoute.addChildren(adminRoutes);

// 4. Xây dựng cây routing cuối cùng
const routeTree = rootRoute.addChildren([
  ...standaloneRoutes,
  adminLayoutRoute, // Thêm layout admin (đã chứa các con của nó) vào root
]);

// 5. Khởi tạo router
export const router = createRouter({
  routeTree,
});

// 6. Khai báo router cho type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}