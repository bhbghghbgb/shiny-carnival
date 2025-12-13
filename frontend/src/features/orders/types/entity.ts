import type { OrderStatus } from '../../../config/api.config';

// Core Order Entity
export interface OrderEntity {
  id: number;
  customerId: number;
  userId: number;
  promoId?: number;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number; // Tổng tiền trước khi giảm giá
  discountAmount: number; // Số tiền được giảm
  finalAmount: number; // Tổng tiền cuối cùng sau khi giảm giá (totalAmount - discountAmount)
}

// Order Item Entity
export interface OrderItemEntity {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  barcode?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Payment Entity
export interface PaymentEntity {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
}

// Extended Order with Details
export interface OrderDetailsDto extends OrderEntity {
  customerName: string;
  customerPhone?: string;
  staffName: string; // Backend trả về StaffName (PascalCase) -> map thành staffName (camelCase)
  promoCode?: string;
  orderItems: OrderItemEntity[];
  paymentInfo?: PaymentEntity;
}
