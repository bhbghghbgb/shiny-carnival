import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { CustomerEntity } from '../types/entity'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/api'

export class CustomerApiService extends BaseApiService<
  CustomerEntity,
  CreateCustomerRequest,
  UpdateCustomerRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.CUSTOMERS,
      axiosInstance: axiosClient,
    })
  }
}

export const customerApiService = new CustomerApiService()

