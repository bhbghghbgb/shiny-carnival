import type { OrderStatus } from '../../../config/api';

// Core Order Entity
export interface OrderEntity {
  id: number;
  customerId: number;
  userId: number;
  promoId?: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
}

// Order Item Entity
export interface OrderItemEntity {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Extended Order with Details
export interface OrderDetailsDto extends OrderEntity {
  customerName: string;
  userName: string;
  promoCode?: string;
  orderItems: OrderItemEntity[];
}
