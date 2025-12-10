import axiosClient, { type ApiResponse, type PagedRequest, type PagedList } from '../../../lib/axios';
import { API_CONFIG, type OrderStatus } from '../../../config/api.config.ts';
import type { OrderEntity, OrderItemEntity, OrderDetailsDto } from '../types/entity.ts';
import type { CreateOrderRequest, UpdateOrderStatusRequest, AddOrderItemRequest, UpdateOrderItemRequest, OrderFilterParams } from '../types/api.ts';

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
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data as Blob;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
