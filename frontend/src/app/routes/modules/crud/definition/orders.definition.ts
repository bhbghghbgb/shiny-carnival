import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type CrudModuleDefinition, type LoaderContext } from '../../../type/types';
import { OrderListPage } from '../../../../../features/orders/pages/OrderListPage';
import { OrderDetailPage } from '../../../../../features/orders/pages/OrderDetailPage';
import { OrderCreatePage } from '../../../../../features/orders/pages/OrderCreatePage';
import { OrderEditPage } from '../../../../../features/orders/pages/OrderEditPage';
import { orders as mockOrders } from '../../../../../_mocks/orders';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API
// --------------------------

type Order = (typeof mockOrders)[number];

interface OrderListData {
  orders: (typeof mockOrders);
  total: number;
}

const orderSearchSchema = baseSearchSchema.extend({
  // status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  // customerId: z.string().optional(),
  // orderDateFrom: z.string().optional(),
  // orderDateTo: z.string().optional(),
  // minAmount: z.number().optional(),
  // maxAmount: z.number().optional(),
  // paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});

export type OrderListSearch = z.infer<typeof orderSearchSchema>;
export type OrderDetailParams = { id: string };

async function fetchOrders(ctx: LoaderContext<Record<string, never>, OrderListSearch, { queryClient: QueryClient }>): Promise<OrderListData> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('orders');
  const queryOpts = queryOptions<OrderListData>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => ({
      orders: mockOrders,
      total: mockOrders.length,
    }),
  });
  return context.queryClient.ensureQueryData(queryOpts);
}

async function fetchOrderById(ctx: LoaderContext<OrderDetailParams, OrderListSearch, { queryClient: QueryClient }>): Promise<Order> {
  const { params, context } = ctx;
  const queryKeys = createQueryKeys('orders');
  const queryOpts = queryOptions<Order>({
    queryKey: [...queryKeys.details(), params.id],
    queryFn: async () => {
      const orderId = parseInt(params.id);
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) throw new Error(`Order with id ${params.id} not found`);
      return order;
    },
  });
  return context.queryClient.ensureQueryData(queryOpts);
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------

export const orderModuleDefinition: CrudModuleDefinition<
  OrderListData,      // Kiểu loader cho List
  Order,              // Kiểu loader cho Detail
  OrderListSearch,    // Kiểu search cho List
  OrderDetailParams,  // Kiểu params cho Detail
  { queryClient: QueryClient }  // Kiểu router context
> = {
  entityName: 'đơn hàng',
  basePath: 'orders',
  components: {
    list: OrderListPage,
    detail: OrderDetailPage,
    create: OrderCreatePage,
    edit: OrderEditPage,
  },
  loaders: {
    list: (ctx) => fetchOrders(ctx),
    detail: (ctx) => fetchOrderById(ctx),
  },
  searchSchemas: {
    list: orderSearchSchema,
  },
};

