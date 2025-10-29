import { z } from 'zod';
import { baseSearchSchema, type CrudModuleDefinition } from '../../../type/types';
import { OrderListPage } from '../../../../../features/orders/pages/OrderListPage';
import { OrderDetailPage } from '../../../../../features/orders/pages/OrderDetailPage';
import { OrderCreatePage } from '../../../../../features/orders/pages/OrderCreatePage';
import { OrderEditPage } from '../../../../../features/orders/pages/OrderEditPage';
import { orders as mockOrders } from '../../../../../_mocks/orders';

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

async function fetchOrders(search: OrderListSearch): Promise<OrderListData> {
  console.log('Fetching orders with:', search);
  return {
    orders: mockOrders,
    total: mockOrders.length
  };
}

async function fetchOrderById(id: string): Promise<Order> {
  console.log('Fetching order with id:', id);
  const orderId = parseInt(id);
  const order = mockOrders.find(o => o.id === orderId);
  if (!order) {
    throw new Error(`Order with id ${id} not found`);
  }
  return order;
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------

export const orderModuleDefinition: CrudModuleDefinition<
  OrderListData,      // Kiểu loader cho List
  Order,              // Kiểu loader cho Detail
  OrderListSearch,    // Kiểu search cho List
  OrderDetailParams,  // Kiểu params cho Detail
  { apiClient: any }  // Kiểu router context
> = {
  entityName: 'đơn hàng',
  basePath: '/orders',
  components: {
    list: OrderListPage,
    detail: OrderDetailPage,
    create: OrderCreatePage,
    edit: OrderEditPage,
  },
  loaders: {
    list: ({ search }) => fetchOrders(search),
    detail: ({ params }) => fetchOrderById(params.id),
  },
  searchSchemas: {
    list: orderSearchSchema,
  },
};

