// frontend/src/app/routes/utils/routeHelpers.ts
import { type RouteComponent, type RouteOptions } from '@tanstack/react-router';
// Import các kiểu dữ liệu cần thiết, bao gồm cả kiểu phân cấp mới
import {
  type ModuleRouteConfig,
  type HierarchicalModuleRouteConfig, // Import kiểu mới
  baseSearchSchema,
  type BaseSearch,
  type ManagementRouteDefinition,
  type CrudModuleDefinition,
} from '../type/types';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';

// Hàm helper để tạo config, giờ đây trả về kiểu phân cấp
function createHierarchicalRouteConfig<TLoaderData, TParams, TSearch extends BaseSearch, TRouterContext>(
  config: Partial<ModuleRouteConfig<TLoaderData, TParams, TSearch, TRouterContext>> & {
    path: string;
    component: RouteComponent;
    children?: HierarchicalModuleRouteConfig[];
  },
  customConfig: Partial<RouteOptions<any>> = {}
): HierarchicalModuleRouteConfig {
  const baseConfig: Partial<HierarchicalModuleRouteConfig> = {
    searchSchema: baseSearchSchema,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
    meta: {
      requiresAuth: true,
      ...config.meta,
    },
  };

  // Hợp nhất các config lại với nhau
  return {
    ...baseConfig,
    ...config,
    ...customConfig,
  } as HierarchicalModuleRouteConfig;
}

/**
 * Tạo ra một cấu trúc config PHÂN CẤP cho một module CRUD.
 * Trả về một mảng chỉ chứa một config gốc (của trang list),
 * config này sẽ chứa các trang detail, create, edit bên trong thuộc tính `children`.
 */
export function generateCRUDRoutes<
  TListLoaderData,
  TDetailLoaderData,
  TListSearch extends BaseSearch,
  TDetailParams extends { id: string },
  TRouterContext
>(
  definition: CrudModuleDefinition<TListLoaderData, TDetailLoaderData, TListSearch, TDetailParams, TRouterContext>,
  customRouteConfigs: {
    list?: Partial<RouteOptions<any>>;
    detail?: Partial<RouteOptions<any>>;
    create?: Partial<RouteOptions<any>>;
    edit?: Partial<RouteOptions<any>>;
  } = {}
): HierarchicalModuleRouteConfig[] { // Kiểu trả về là config phân cấp
  const { entityName, basePath, components, loaders, searchSchemas } = definition;

  // 1. Định nghĩa config cho từng trang một cách riêng lẻ.
  const editConfig = createHierarchicalRouteConfig(
    {
      path: 'edit', // path tương đối so với cha của nó (detail)
      component: components.edit,
      meta: { title: `Chỉnh sửa ${entityName}`, requiresAuth: true },
    },
    customRouteConfigs.edit
  );

  const detailConfig = createHierarchicalRouteConfig(
    {
      path: '$id', // path tương đối so với cha của nó (list)
      component: components.detail,
      loader: loaders.detail,
      meta: { title: `Chi tiết ${entityName}`, requiresAuth: true },
      children: [editConfig], // Lồng config 'edit' vào làm con của 'detail'
    },
    customRouteConfigs.detail
  );

  const createConfig = createHierarchicalRouteConfig(
    {
      path: 'create', // path tương đối so với cha của nó (list)
      component: components.create,
      meta: { title: `Tạo ${entityName} mới`, requiresAuth: true },
    },
    customRouteConfigs.create
  );

  const listConfig = createHierarchicalRouteConfig(
    {
      path: basePath, // path này tương đối so với layout cha (ví dụ: /admin)
      component: components.list,
      searchSchema: searchSchemas.list,
      loader: loaders.list,
      meta: { title: `Quản lý ${entityName}`, requiresAuth: true },
      children: [detailConfig, createConfig], // Lồng 'detail' và 'create' vào làm con
    },
    customRouteConfigs.list
  );

  // 2. Trả về một mảng chỉ chứa config GỐC của module này.
  return [listConfig];
}

/**
 * Tạo ra config cho một trang quản lý đơn lẻ (không có trang con).
 */
export function generateManagementRoute<
  TLoaderData,
  TSearch extends BaseSearch,
  TRouterContext
>(
  definition: ManagementRouteDefinition<TLoaderData, TSearch, TRouterContext>,
  customRouteConfig: Partial<RouteOptions<any>> = {}
): HierarchicalModuleRouteConfig[] {
  const adminConfig = createHierarchicalRouteConfig({
    path: definition.path,
    component: definition.component,
    searchSchema: definition.searchSchema,
    loader: definition.loader,
    meta: {
      title: `Quản trị ${definition.entityName}`,
      requiresAuth: true,
    },
  }, customRouteConfig);

  return [adminConfig];
}

// Hàm `createLayoutRoute` trong kế hoạch cũ không còn cần thiết
// trong kiến trúc này và có thể được xóa bỏ an toàn.