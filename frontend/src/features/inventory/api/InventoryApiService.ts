import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest, LowStockAlert } from '../types/api'
import type { ApiResponse } from '../../../lib/api/types/api.types'
import { unwrapResponse } from '../../../lib/api/base/apiResponseAdapter'

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

  /**
   * GET inventory by productId
   * Backend endpoint: GET /api/admin/inventory/{productId}
   * Khác với BaseApiService.getById() vì endpoint dùng productId thay vì id
   */
  async getByProductId(productId: number): Promise<InventoryEntity> {
    const response = await this.axios.get<ApiResponse<InventoryEntity>>(
      API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_BY_PRODUCT(productId)
    )
    return unwrapResponse(response)
  }

  /**
   * PATCH update inventory by productId
   * Backend endpoint: PATCH /api/admin/inventory/{productId}
   * Khác với BaseApiService.patch() vì endpoint dùng productId thay vì id
   */
  async updateByProductId(productId: number, data: UpdateInventoryRequest): Promise<InventoryEntity> {
    const response = await this.axios.patch<ApiResponse<InventoryEntity>>(
      API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_BY_PRODUCT(productId),
      data
    )
    return unwrapResponse(response)
  }
  /**
   * GET low stock alerts
   * Backend endpoint: GET /api/admin/inventory/low-stock
   */
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    const response = await this.axios.get<ApiResponse<LowStockAlert[]>>(
      API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_LOW_STOCK
    );
    return unwrapResponse(response);
  }
}

export const inventoryApiService = new InventoryApiService()

