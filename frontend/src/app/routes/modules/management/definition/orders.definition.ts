import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { OrderManagementPage } from '../../../../../features/orders/pages/OrderManagementPage';
import { orderApiService } from '../../../../../features/orders/api/OrderApiService';
import type { OrderEntity } from '../../../../../features/orders/types/entity';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';
import { API_CONFIG } from '../../../../../config/api.config';

// 1. Định nghĩa Types và API

const orderSearchSchema = baseSearchSchema.extend({
  status: z.enum([API_CONFIG.ORDER_STATUS.PENDING, API_CONFIG.ORDER_STATUS.PAID, API_CONFIG.ORDER_STATUS.CANCELED]).optional(),
  customerId: z.number().optional(),
  userId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortField: z.string().catch('id'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
});

export type OrderSearch = z.infer<typeof orderSearchSchema>;

function buildPagedRequest(search: OrderSearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'orderDate' ? 'OrderDate' :
      search.sortField === 'totalAmount' ? 'TotalAmount' : 'Id',
    sortDesc: search.sortOrder === 'descend',
    ...(search.status !== undefined && { status: search.status }),
    ...(search.customerId !== undefined && { customerId: search.customerId }),
    ...(search.userId !== undefined && { userId: search.userId }),
    ...(search.startDate !== undefined && { startDate: search.startDate }),
    ...(search.endDate !== undefined && { endDate: search.endDate }),
  };
}

async function fetchOrders(ctx: LoaderContext<Record<string, never>, OrderSearch, { queryClient: QueryClient }>): Promise<{ orders: OrderEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const ordersQueryOptions = createPaginatedQueryOptions<OrderEntity>(
    'orders',
    orderApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(ordersQueryOptions);

  return {
    orders: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị

export const orderAdminDefinition: ManagementRouteDefinition<
  { orders: OrderEntity[]; total: number },
  OrderSearch,
  { queryClient: QueryClient }
> = {
  entityName: 'Đơn hàng',
  path: 'orders',
  component: OrderManagementPage,
  searchSchema: orderSearchSchema,
  loader: (ctx) => fetchOrders(ctx),
};

export function createOrdersQueryOptions(search: OrderSearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<OrderEntity>('orders', orderApiService, params);
}

