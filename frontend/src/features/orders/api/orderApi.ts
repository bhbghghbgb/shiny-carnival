import axiosClient, { ApiResponse } from '../../../lib/axios';
import { API_CONFIG, OrderStatus } from '../../../config/api';
import { PagedRequest, PagedList } from '../products/api/productApi';

// Types cho Order API
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

export interface OrderItemEntity {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderDetailsDto extends OrderEntity {
  customerName: string;
  userName: string;
  promoCode?: string;
  orderItems: OrderItemEntity[];
}

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

// Order API functions
export const orderApi = {
  /**
   * Lấy danh sách đơn hàng với phân trang và lọc
   */
  getOrders: async (params?: OrderFilterParams): Promise<ApiResponse<PagedList<OrderEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<OrderEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDERS,
        { params },
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách đơn hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  getOrderById: async (id: number): Promise<ApiResponse<OrderDetailsDto>> => {
    try {
      const response = await axiosClient.get<ApiResponse<OrderDetailsDto>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDER_BY_ID(id)
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy chi tiết đơn hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo đơn hàng mới (Staff)
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<ApiResponse<OrderDetailsDto>> => {
    try {
      const response = await axiosClient.post<ApiResponse<OrderDetailsDto>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDERS,
        orderData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo đơn hàng mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (Staff)
   */
  updateOrderStatus: async (id: number, statusData: UpdateOrderStatusRequest): Promise<ApiResponse<OrderEntity>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<OrderEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDER_STATUS(id),
        statusData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật trạng thái đơn hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xuất hóa đơn PDF (Staff)
   */
  exportInvoice: async (id: number): Promise<Blob> => {
    try {
      const response = await axiosClient.get(
        API_CONFIG.ENDPOINTS.ADMIN.ORDER_INVOICE(id),
        {
          responseType: 'blob'
        }
      );
      return response as unknown as Blob;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xuất hóa đơn',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Thêm sản phẩm vào đơn hàng (Staff)
   */
  addOrderItem: async (orderId: number, itemData: AddOrderItemRequest): Promise<ApiResponse<OrderItemEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<OrderItemEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDER_ITEMS(orderId),
        itemData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể thêm sản phẩm vào đơn hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật số lượng sản phẩm trong đơn hàng (Staff)
   */
  updateOrderItem: async (orderId: number, itemId: number, itemData: UpdateOrderItemRequest): Promise<ApiResponse<OrderItemEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<OrderItemEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDER_ITEM_BY_ID(orderId, itemId),
        itemData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật sản phẩm trong đơn hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa sản phẩm khỏi đơn hàng (Staff)
   */
  removeOrderItem: async (orderId: number, itemId: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.ORDER_ITEM_BY_ID(orderId, itemId)
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa sản phẩm khỏi đơn hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default orderApi;
