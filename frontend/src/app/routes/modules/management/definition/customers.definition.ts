import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { CustomerManagementPage } from '../../../../../features/customers/pages/CustomerManagementPage';
import { customerApiService } from '../../../../../features/customers/api/CustomerApiService';
import type { CustomerEntity } from '../../../../../features/customers/types/entity';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API

const customerSearchSchema = baseSearchSchema.extend({
  sortField: z.string().catch('id'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
});

export type CustomerSearch = z.infer<typeof customerSearchSchema>;

function buildPagedRequest(search: CustomerSearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'name' ? 'Name' : 'Id',
    sortDesc: search.sortOrder === 'descend',
  };
}

async function fetchCustomers(ctx: LoaderContext<Record<string, never>, CustomerSearch, { queryClient: QueryClient }>): Promise<{ customers: CustomerEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const customersQueryOptions = createPaginatedQueryOptions<CustomerEntity>(
    'customers',
    customerApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(customersQueryOptions);

  return {
    customers: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị

export const customerAdminDefinition: ManagementRouteDefinition<
  { customers: CustomerEntity[]; total: number },
  CustomerSearch,
  { queryClient: QueryClient }
> = {
  entityName: 'Khách hàng',
  path: 'customers',
  component: CustomerManagementPage,
  searchSchema: customerSearchSchema,
  loader: (ctx) => fetchCustomers(ctx),
  allowedRoles: ['admin'], // Chỉ Admin được truy cập
};

export function createCustomersQueryOptions(search: CustomerSearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<CustomerEntity>('customers', customerApiService, params);
}
