import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { SupplierManagementPage } from '../../../../../features/suppliers/pages/SupplierManagementPage';
import { supplierApiService } from '../../../../../features/suppliers/api';
import type { SupplierEntity } from '../../../../../features/suppliers/types/entity';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API

const supplierSearchSchema = baseSearchSchema.extend({
  sortField: z.string().catch('id'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
});

export type SupplierSearch = z.infer<typeof supplierSearchSchema>;

function buildPagedRequest(search: SupplierSearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'name' ? 'Name' : 'Id',
    sortDesc: search.sortOrder === 'descend',
  };
}

async function fetchSuppliers(ctx: LoaderContext<Record<string, never>, SupplierSearch, { queryClient: QueryClient }>): Promise<{ suppliers: SupplierEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const suppliersQueryOptions = createPaginatedQueryOptions<SupplierEntity>(
    'suppliers',
    supplierApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(suppliersQueryOptions);

  return {
    suppliers: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const supplierAdminDefinition: ManagementRouteDefinition<
  { suppliers: SupplierEntity[]; total: number },
  SupplierSearch,
  { queryClient: QueryClient }
> = {
  entityName: 'Nhà cung cấp',
  path: 'suppliers',
  component: SupplierManagementPage,
  searchSchema: supplierSearchSchema,
  loader: (ctx) => fetchSuppliers(ctx),
  allowedRoles: ['admin', 'staff'], // Admin và Staff đều truy cập được
};

export function createSuppliersQueryOptions(search: SupplierSearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<SupplierEntity>('suppliers', supplierApiService, params);
}