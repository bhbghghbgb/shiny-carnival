import { z } from 'zod';
import { type RouteComponent } from '@tanstack/react-router';
import { type ModuleRouteConfig, baseSearchSchema } from '../type/types';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';

// Helper function để tạo route config với default values
export const createRouteConfig = (
  config: Partial<ModuleRouteConfig> & {
    path: string;
    component: RouteComponent;
  }
): ModuleRouteConfig => {
  return {
    searchSchema: baseSearchSchema,
    pendingComponent: PendingComponent,
    errorComponent: ErrorComponent,
    meta: {
      requiresAuth: true,
      ...config.meta,
    },
    ...config,
  };
};

// Helper function để tạo CRUD routes cho một entity
export const createCRUDRoutes = (
  entityName: string,
  basePath: string,
  components: {
    list: RouteComponent;
    detail: RouteComponent;
    create: RouteComponent;
    edit: RouteComponent;
  },
  options?: {
    searchSchema?: z.ZodSchema<any>;
    requiresAuth?: boolean;
    customLoader?: any;
  }
): ModuleRouteConfig[] => {
  const searchSchema = options?.searchSchema || baseSearchSchema;
  const requiresAuth = options?.requiresAuth ?? true;

  return [
    // List route
    createRouteConfig({
      path: basePath,
      component: components.list,
      searchSchema,
      meta: {
        title: `Quản lý ${entityName}`,
        description: `Trang quản lý danh sách ${entityName}`,
        requiresAuth,
      },
    }),
    // Detail route
    createRouteConfig({
      path: `${basePath}/$id`,
      component: components.detail,
      meta: {
        title: `Chi tiết ${entityName}`,
        description: `Xem thông tin chi tiết ${entityName}`,
        requiresAuth,
      },
    }),
    // Create route
    createRouteConfig({
      path: `${basePath}/create`,
      component: components.create,
      meta: {
        title: `Tạo ${entityName} mới`,
        description: `Trang tạo ${entityName} mới`,
        requiresAuth: true,
      },
    }),
    // Edit route
    createRouteConfig({
      path: `${basePath}/$id/edit`,
      component: components.edit,
      meta: {
        title: `Chỉnh sửa ${entityName}`,
        description: `Trang chỉnh sửa thông tin ${entityName}`,
        requiresAuth: true,
      },
    }),
  ];
};

// Helper function để tạo admin routes cho một entity (single management page)
export const createAdminRoutes = (
  entityName: string,
  basePath: string,
  managementComponent: RouteComponent,
  options?: {
    searchSchema?: z.ZodSchema<any>;
    requiresAuth?: boolean;
    customLoader?: any;
  }
): ModuleRouteConfig[] => {
  const searchSchema = options?.searchSchema || baseSearchSchema;
  const requiresAuth = options?.requiresAuth ?? true;

  return [
    // Single management route for admin CRUD operations
    createRouteConfig({
      path: basePath,
      component: managementComponent,
      searchSchema,
      meta: {
        title: `Quản trị ${entityName}`,
        description: `Trang quản trị ${entityName} - Quản lý toàn bộ CRUD operations`,
        requiresAuth,
      },
    }),
  ];
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
