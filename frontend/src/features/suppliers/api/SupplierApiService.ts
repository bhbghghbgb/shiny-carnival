import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { SupplierEntity } from '../types/entity'
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api'

export class SupplierApiService extends BaseApiService<
  SupplierEntity,
  CreateSupplierRequest,
  UpdateSupplierRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.SUPPLIERS,
      axiosInstance: axiosClient,
    })
  }
}

export const supplierApiService = new SupplierApiService()


