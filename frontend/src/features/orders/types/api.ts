import type { PagedRequest } from '../../../lib/axios';
import type { OrderStatus } from '../../../config/api';

export interface CreateOrderRequest {
  customerId: number;
  promoCode?: string;
  orderItems: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface AddOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateOrderItemRequest {
  quantity: number;
}

export interface OrderFilterParams extends PagedRequest {
  status?: OrderStatus;
  customerId?: number;
  userId?: number;
  startDate?: string;
  endDate?: string;
}
