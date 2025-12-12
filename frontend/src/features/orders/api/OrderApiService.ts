import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { OrderEntity } from '../types/entity'
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
}

export const orderApiService = new OrderApiService()

