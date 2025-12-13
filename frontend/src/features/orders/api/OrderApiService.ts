import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { OrderDetailsDto, OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'
import type { ApiResponse } from '../../../lib/api/types/api.types'
import { unwrapResponse } from '../../../lib/api/base/apiResponseAdapter'

export class OrderApiService extends BaseApiService<
  OrderEntity,
  CreateOrderRequest,
  UpdateOrderStatusRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.ORDERS,
      axiosInstance: axiosClient,
    })
  }

  /**
   * Update status với endpoint đặc biệt: PATCH /api/admin/orders/{id}/status
   */
  async updateStatus(id: number, data: UpdateOrderStatusRequest): Promise<OrderEntity> {
    return this.custom<OrderEntity>('patch', `${id}/status`, data)
  }

  /**
   * GET order details: GET /api/admin/orders/{id}
   * Lấy chi tiết đơn hàng bao gồm order items và payment info
   */
  async getOrderDetails(id: number): Promise<OrderDetailsDto> {
    const response = await this.axios.get<ApiResponse<OrderDetailsDto>>(
      `${this.endpoint}/${id}`
    ) as unknown as ApiResponse<OrderDetailsDto>
    return unwrapResponse(response)
  }

  /**
   * GET total revenue: GET /api/admin/orders/total-revenue
   * Tính tổng doanh thu (FinalAmount = TotalAmount - DiscountAmount)
   * Có thể filter theo OrderRevenueRequest (status, customerId, userId, date range, etc.)
   */
  async getTotalRevenue(params?: {
    status?: string;
    customerId?: number;
    userId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<number> {
    // Chỉ gửi các params có giá trị (loại bỏ undefined/null)
    const cleanParams: Record<string, any> = {}
    if (params) {
      if (params.status !== undefined && params.status !== null) cleanParams.Status = params.status
      if (params.customerId !== undefined && params.customerId !== null) cleanParams.CustomerId = params.customerId
      if (params.userId !== undefined && params.userId !== null) cleanParams.UserId = params.userId
      if (params.startDate !== undefined && params.startDate !== null) cleanParams.StartDate = params.startDate
      if (params.endDate !== undefined && params.endDate !== null) cleanParams.EndDate = params.endDate
      if (params.search !== undefined && params.search !== null && params.search !== '') cleanParams.Search = params.search
    }
    
    const response = await this.axios.get<ApiResponse<number>>(
      API_CONFIG.ENDPOINTS.ADMIN.ORDER_TOTAL_REVENUE,
      { params: cleanParams }
    ) as unknown as ApiResponse<number>
    return unwrapResponse(response)
  }
}

export const orderApiService = new OrderApiService()

