import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { CustomerEntity, CustomerDetailsDto } from '../types/entity'
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

  /**
   * GET customer details: GET /api/admin/customers/{id}
   * Lấy chi tiết khách hàng bao gồm TotalOrders và TotalSpent
   * 
   * Sử dụng getById() từ BaseApiService với type assertion để trả về CustomerDetailsDto
   * thay vì CustomerEntity (vì backend trả về CustomerResponseDto với đầy đủ thông tin)
   */
  async getCustomerDetails(id: number): Promise<CustomerDetailsDto> {
    // Sử dụng getById() từ BaseApiService và cast type sang CustomerDetailsDto
    // vì backend trả về CustomerResponseDto (có totalOrders, totalSpent, etc.)
    return this.getById(id) as Promise<CustomerDetailsDto>
  }
}

export const customerApiService = new CustomerApiService()

