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

// Interface cho module route configuration
export interface ModuleRouteConfig {
  path: string;
  component: RouteComponent;
  searchSchema?: z.ZodSchema<any>;
  // TODO: Add proper types for loader and beforeLoad
  loader?: any;
  beforeLoad?: any;
  pendingComponent?: RouteComponent;
  errorComponent?: ErrorRouteComponent;
  meta?: {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
  };
}

// Interface cho module routes
export interface ModuleRoutes {
  moduleName: string;
  basePath: string;
  routes: ModuleRouteConfig[];
}

// Common route options
export interface CommonRouteOptions {
  pendingComponent?: any;
  errorComponent?: any;
  requiresAuth?: boolean;
}
