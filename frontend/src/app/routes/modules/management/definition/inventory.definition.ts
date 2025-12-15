import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { InventoryManagementPage } from '../../../../../features/inventory/pages/InventoryManagementPage';
import { inventoryApiService } from '../../../../../features/inventory/api/InventoryApiService';
import type { InventoryEntity } from '../../../../../features/inventory/types/inventoryEntity';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API

const inventorySearchSchema = baseSearchSchema.extend({
  productId: z.number().optional(),
  minQuantity: z.number().optional(),
  maxQuantity: z.number().optional(),
  sortField: z.string().catch('id'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
});

export type InventorySearch = z.infer<typeof inventorySearchSchema>;

function buildPagedRequest(search: InventorySearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'quantity' ? 'Quantity' : 'Id',
    sortDesc: search.sortOrder === 'descend',
    ...(search.productId !== undefined && { productId: search.productId }),
    ...(search.minQuantity !== undefined && { minQuantity: search.minQuantity }),
    ...(search.maxQuantity !== undefined && { maxQuantity: search.maxQuantity }),
  };
}

async function fetchInventories(ctx: LoaderContext<Record<string, never>, InventorySearch, { queryClient: QueryClient }>): Promise<{ inventories: InventoryEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const inventoriesQueryOptions = createPaginatedQueryOptions<InventoryEntity>(
    'inventory',
    inventoryApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(inventoriesQueryOptions);

  return {
    inventories: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị

export const inventoryAdminDefinition: ManagementRouteDefinition<
  { inventories: InventoryEntity[]; total: number },
  InventorySearch,
  { queryClient: QueryClient }
> = {
  entityName: 'Tồn kho',
  path: 'inventory',
  component: InventoryManagementPage,
  searchSchema: inventorySearchSchema,
  loader: (ctx) => fetchInventories(ctx),
  allowedRoles: ['admin', 'staff'], // Admin và Staff đều truy cập được
};

export function createInventoriesQueryOptions(search: InventorySearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<InventoryEntity>('inventory', inventoryApiService, params);
}

