import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { OrderDetailsDto, OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'

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
   * 
   * Sử dụng getById() từ BaseApiService với type assertion để trả về OrderDetailsDto
   * thay vì OrderEntity (vì backend trả về OrderDetailsDto với đầy đủ thông tin)
   */
  async getOrderDetails(id: number): Promise<OrderDetailsDto> {
    // Sử dụng getById() từ BaseApiService và cast type sang OrderDetailsDto
    // vì backend trả về OrderDetailsDto (có orderItems, paymentInfo, customerName, etc.)
    return this.getById(id) as Promise<OrderDetailsDto>
  }

  /**
   * GET total revenue: GET /api/admin/orders/total-revenue
   * Tính tổng doanh thu (FinalAmount = TotalAmount - DiscountAmount)
   * Có thể filter theo OrderRevenueRequest (status, customerId, userId, date range, etc.)
   * 
   * Sử dụng custom() method từ BaseApiService vì endpoint không theo pattern CRUD chuẩn
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
      if (params.status !== undefined && params.status !== null) cleanParams.status = params.status
      if (params.customerId !== undefined && params.customerId !== null) cleanParams.customerId = params.customerId
      if (params.userId !== undefined && params.userId !== null) cleanParams.userId = params.userId
      if (params.startDate !== undefined && params.startDate !== null) cleanParams.startDate = params.startDate
      if (params.endDate !== undefined && params.endDate !== null) cleanParams.endDate = params.endDate
      if (params.search !== undefined && params.search !== null && params.search !== '') cleanParams.search = params.search
    }
    
    // Sử dụng custom() method - BaseApiService sẽ tự động convert camelCase sang PascalCase
    return this.custom<number>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.ORDER_TOTAL_REVENUE,
      undefined,
      cleanParams
    )
  }
}

export const orderApiService = new OrderApiService()

