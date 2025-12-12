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
}

export const orderApiService = new OrderApiService()

