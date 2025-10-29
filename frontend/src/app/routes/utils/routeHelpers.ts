import { type RouteComponent } from '@tanstack/react-router';
import { type ModuleRouteConfig, baseSearchSchema, type BaseSearch, type ManagementRouteDefinition, type CrudModuleDefinition, type ModuleRoutes } from '../type/types';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';


// Factory function để tạo type-safe route config
export function createModuleRouteConfig<
  TLoaderData = unknown,
  TParams = Record<string, unknown>,
  TSearch extends BaseSearch = BaseSearch,
  TRouterContext = Record<string, unknown>
>(
  config: ModuleRouteConfig<TLoaderData, TParams, TSearch, TRouterContext>
): ModuleRouteConfig<TLoaderData, TParams, TSearch, TRouterContext> {
  return config;
}

// Factory function để tạo module routes
export function createModuleRoutes<
  TConfigs extends readonly ModuleRouteConfig<any, any, any, any>[]
>(
  moduleName: string,
  basePath: string,
  routes: TConfigs
): ModuleRoutes<TConfigs> {
  return {
    moduleName,
    basePath,
    routes,
  };
}

// Helper function để tạo route config với default values (backward compatibility)
export const createRouteConfig = (
  config: Partial<ModuleRouteConfig> & {
    path: string;
    component: RouteComponent;
  }
): ModuleRouteConfig => {
  return createModuleRouteConfig({
    searchSchema: baseSearchSchema,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
    meta: {
      requiresAuth: true,
      ...config.meta,
    },
    ...config,
  });
};

// Helper function để tạo nested routes
export const createNestedRoutes = (
  parentPath: string,
  childRoutes: ModuleRouteConfig[]
): ModuleRouteConfig[] => {
  return childRoutes.map(route => ({
    ...route,
    path: `${parentPath}${route.path}`,
  }));
};

// Helper function để merge multiple route modules
export const mergeRouteModules = (...modules: ModuleRouteConfig[][]): ModuleRouteConfig[] => {
  return modules.flat();
};


// Hàm "Generator" - Đọc bản thiết kế và tạo ra các route type-safe
export function generateCRUDRoutes<
  TListLoaderData,
  TDetailLoaderData,
  TListSearch extends BaseSearch,
  TDetailParams extends { id: string },
  TRouterContext
>(
  definition: CrudModuleDefinition<TListLoaderData, TDetailLoaderData, TListSearch, TDetailParams, TRouterContext>
) {
  const { entityName, basePath, components, loaders, searchSchemas } = definition;

  // 1. List Route (Type-Safe)
  const listRoute = createModuleRouteConfig<
    TListLoaderData,
    Record<string, never>,
    TListSearch,
    TRouterContext
  >({
    path: basePath,
    component: components.list,
    searchSchema: searchSchemas.list,
    loader: loaders.list,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
    meta: {
      title: `Quản lý ${entityName}`,
      requiresAuth: true,
    },
  });

  // 2. Detail Route (Type-Safe)
  const detailRoute = createModuleRouteConfig<
    TDetailLoaderData,
    TDetailParams,
    BaseSearch,
    TRouterContext
  >({
    path: `${basePath}/$id`,
    component: components.detail,
    loader: loaders.detail,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
    meta: {
      title: `Chi tiết ${entityName}`,
      requiresAuth: true,
    },
  });

  // 3. Create & Edit Routes (sử dụng helper cũ vì không cần loader phức tạp)
  const createRoute = createRouteConfig({
    path: `${basePath}/create`,
    component: components.create,
    meta: { title: `Tạo ${entityName} mới`, requiresAuth: true },
  });

  const editRoute = createRouteConfig({
    path: `${basePath}/$id/edit`,
    component: components.edit,
    meta: { title: `Chỉnh sửa ${entityName}`, requiresAuth: true },
  });

  return [listRoute, detailRoute, createRoute, editRoute] as const;
}


// Hàm "Generator" - Đọc bản thiết kế và tạo ra route type-safe
export function generateManagementRoute<
  TLoaderData,
  TSearch extends BaseSearch,
  TRouterContext
>(
  definition: ManagementRouteDefinition<TLoaderData, TSearch, TRouterContext>
) {
  const adminRoute = createModuleRouteConfig<
    TLoaderData,
    Record<string, never>,
    TSearch,
    TRouterContext
  >({
    path: definition.path,
    component: definition.component,
    searchSchema: definition.searchSchema,
    loader: definition.loader,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
    meta: {
      title: `Quản trị ${definition.entityName}`,
      requiresAuth: true,
    },
  });

  // Trả về một mảng chứa route duy nhất để tương thích với cấu trúc module
  return [adminRoute] as const;
}