import {
  type RouteComponent,
  type ErrorRouteComponent,
} from '@tanstack/react-router';
import { z } from 'zod';

// Base search schema cho pagination
export const baseSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  search: z.string().optional(),
});

export type BaseSearch = z.infer<typeof baseSearchSchema>;

// Improved loader context type với generic support
export interface LoaderContext<
  TParams = Record<string, unknown>,
  TSearch = Record<string, unknown>,
  TRouterContext = Record<string, unknown>
> {
  params: TParams;
  search: TSearch;
  context: TRouterContext;
  abortController: AbortController;
  preload: boolean;
}

// Improved ModuleRouteConfig với type safety
export interface ModuleRouteConfig<
  TLoaderData = unknown,
  TParams = Record<string, unknown>,
  TSearch extends BaseSearch = BaseSearch,
  TRouterContext = Record<string, unknown>
> {
  path: string;
  component: RouteComponent;

  // Search schema với type constraint
  searchSchema?: z.ZodSchema<TSearch>;

  // Loader với proper typing
  loader?: (
    ctx: LoaderContext<TParams, TSearch, TRouterContext>
  ) => Promise<TLoaderData> | TLoaderData;

  // BeforeLoad với proper typing
  beforeLoad?: (
    ctx: LoaderContext<TParams, TSearch, TRouterContext>
  ) => Promise<Partial<TRouterContext>> | Partial<TRouterContext>;

  pendingComponent?: RouteComponent;
  errorComponent?: ErrorRouteComponent;

  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
  };
}

// Type for hierarchical route configs
export type HierarchicalModuleRouteConfig = ModuleRouteConfig & {
  children?: HierarchicalModuleRouteConfig[];
};


// Helper type để extract loader data type
export type ExtractLoaderData<T> = T extends ModuleRouteConfig<infer U, any, any, any> ? U : never;

// Helper type để extract params type
export type ExtractParams<T> = T extends ModuleRouteConfig<any, infer U, any, any> ? U : never;

// Helper type để extract search type
export type ExtractSearch<T> = T extends ModuleRouteConfig<any, any, infer U, any> ? U : never;

// Improved ModuleRoutes interface
export interface ModuleRoutes<TConfigs extends readonly ModuleRouteConfig<any, any, any, any>[]> {
  moduleName: string;
  basePath: string;
  routes: TConfigs;
}



// Backward compatibility: Non-generic version for existing code
export type LegacyModuleRoutes = ModuleRoutes<ModuleRouteConfig[]>;


// Interface cho "Bản thiết kế trang quản trị"
export interface ManagementRouteDefinition<
  TLoaderData,
  TSearch extends BaseSearch,
  TRouterContext
> {
  entityName: string;
  path: string;
  component: RouteComponent;
  loader: (ctx: LoaderContext<Record<string, never>, TSearch, TRouterContext>) => Promise<TLoaderData> | TLoaderData;
  searchSchema: z.ZodSchema<TSearch>;
}

// Interface cho "Bản thiết kế CRUD"
export interface CrudModuleDefinition<
  TListLoaderData,
  TDetailLoaderData,
  TListSearch extends BaseSearch,
  TDetailParams extends { id: string },
  TRouterContext
> {
  entityName: string;
  basePath: string;
  components: {
    list: RouteComponent;
    detail: RouteComponent;
    create: RouteComponent;
    edit: RouteComponent;
  };
  loaders: {
    list: (ctx: LoaderContext<Record<string, never>, TListSearch, TRouterContext>) => Promise<TListLoaderData> | TListLoaderData;
    detail: (ctx: LoaderContext<TDetailParams, BaseSearch, TRouterContext>) => Promise<TDetailLoaderData> | TDetailLoaderData;
  };
  searchSchemas: {
    list: z.ZodSchema<TListSearch>;
  };
}

