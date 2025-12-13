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

/**
 * Helper function để tự động thêm basePath vào path tương đối
 * @param basePath - Base path của module (ví dụ: 'customers')
 * @param relativePath - Path tương đối (ví dụ: 'create', '$id', '$id/edit')
 * @returns Path đầy đủ
 *
 * @example
 * resolvePath('customers', 'create') → 'customers/create'
 * resolvePath('customers', '$id') → 'customers/$id'
 * resolvePath('customers', '$id/edit') → 'customers/$id/edit'
 * resolvePath('customers', 'customers') → 'customers' (không duplicate)
 */
function resolvePath(basePath: string, relativePath: string): string {
  // Nếu relativePath là chính basePath → trả về nguyên
  if (relativePath === basePath) {
    return basePath;
  }

  // Nếu relativePath bắt đầu bằng '/' → absolute path, trả về nguyên
  if (relativePath.startsWith('/')) {
    return relativePath;
  }

  // Nếu relativePath đã chứa basePath → trả về nguyên (tránh duplicate)
  if (relativePath.startsWith(`${basePath}/`)) {
    return relativePath;
  }

  // Trường hợp còn lại: thêm basePath vào đầu
  return `${basePath}/${relativePath}`;
}

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
 * Tạo ra một cấu trúc config FLAT (không nested) cho một module CRUD.
 * Trả về một mảng chứa TẤT CẢ các routes ngang hàng nhau (list, create, detail, edit).
 * Mỗi route là độc lập, không phụ thuộc vào route cha.
 */
export function generateCRUDRoutesConfigs<
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
): HierarchicalModuleRouteConfig[] {
  const { entityName, basePath, components, loaders, searchSchemas } = definition;

  // 1. List Route - Độc lập
  const listConfig = createHierarchicalRouteConfig(
    {
      path: basePath, // 'customers'
      component: components.list,
      searchSchema: searchSchemas.list,
      loader: loaders.list,
      meta: { title: `Quản lý ${entityName}`, requiresAuth: true },
      // ✅ KHÔNG có children
    },
    customRouteConfigs.list
  );

  // 2. Create Route - Độc lập, sử dụng resolvePath
  const createConfig = createHierarchicalRouteConfig(
    {
      path: resolvePath(basePath, 'create'), // ✅ Tự động thành 'customers/create'
      component: components.create,
      meta: { title: `Tạo ${entityName} mới`, requiresAuth: true },
      // ✅ KHÔNG có children
    },
    customRouteConfigs.create
  );

  // 3. Detail Route - Độc lập, sử dụng resolvePath
  const detailConfig = createHierarchicalRouteConfig(
    {
      path: resolvePath(basePath, '$id'), // ✅ Tự động thành 'customers/$id'
      component: components.detail,
      loader: loaders.detail,
      meta: { title: `Chi tiết ${entityName}`, requiresAuth: true },
      // ✅ KHÔNG có children
    },
    customRouteConfigs.detail
  );

  // 4. Edit Route - Độc lập, sử dụng resolvePath
  const editConfig = createHierarchicalRouteConfig(
    {
      path: resolvePath(basePath, '$id/edit'), // ✅ Tự động thành 'customers/$id/edit'
      component: components.edit,
      loader: loaders.detail, // ✅ Có thể dùng lại loader của detail
      meta: { title: `Chỉnh sửa ${entityName}`, requiresAuth: true },
      // ✅ KHÔNG có children
    },
    customRouteConfigs.edit
  );

  // ✅ Trả về TẤT CẢ routes ngang hàng nhau
  return [listConfig, createConfig, detailConfig, editConfig];
}

/**
 * Tạo ra config cho một trang quản lý đơn lẻ (không có trang con).
 */
export function generateManagementRouteConfigs<
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

// ============================================================================
// Export Aliases - Để tương thích với code cũ
// ============================================================================

/**
 * Alias cho generateCRUDRoutesConfigs
 * @deprecated Sử dụng generateCRUDRoutesConfigs thay thế
 */
export const generateCRUDRoutes = generateCRUDRoutesConfigs;

/**
 * Alias cho generateManagementRouteConfigs
 * @deprecated Sử dụng generateManagementRouteConfigs thay thế
 */
export const generateManagementRoute = generateManagementRouteConfigs;