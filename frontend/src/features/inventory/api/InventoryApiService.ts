import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest, LowStockAlert } from '../types/api'

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
   * 
   * Sử dụng custom() method từ BaseApiService vì endpoint pattern khác
   */
  async getByProductId(productId: number): Promise<InventoryEntity> {
    return this.custom<InventoryEntity>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_BY_PRODUCT(productId)
    )
  }

  /**
   * PATCH update inventory by productId
   * Backend endpoint: PATCH /api/admin/inventory/{productId}
   * Khác với BaseApiService.patch() vì endpoint dùng productId thay vì id
   * 
   * Sử dụng custom() method từ BaseApiService vì endpoint pattern khác
   */
  async updateByProductId(productId: number, data: UpdateInventoryRequest): Promise<InventoryEntity> {
    return this.custom<InventoryEntity>(
      'patch',
      API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_BY_PRODUCT(productId),
      data
    )
  }
  /**
   * GET low stock alerts
   * Backend endpoint: GET /api/admin/inventory/low-stock
   * 
   * Sử dụng custom() method từ BaseApiService vì endpoint không theo pattern CRUD chuẩn
   */
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    return this.custom<LowStockAlert[]>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.INVENTORY_LOW_STOCK
    )
  }
}

export const inventoryApiService = new InventoryApiService()

