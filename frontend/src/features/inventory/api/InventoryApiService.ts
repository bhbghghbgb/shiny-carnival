import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest } from '../types/api'

export class InventoryApiService extends BaseApiService<
  InventoryEntity,
  never, // Không có create
  UpdateInventoryRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.INVENTORY,
      axiosInstance: axiosClient,
    })
  }
}

export const inventoryApiService = new InventoryApiService()

