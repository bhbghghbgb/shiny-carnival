import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest, ValidatePromoRequest } from '../types/api'

export class PromotionApiService extends BaseApiService<
  PromotionEntity,
  CreatePromotionRequest,
  UpdatePromotionRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.PROMOTIONS,
      axiosInstance: axiosClient,
    })
  }

  /**
   * POST validate promo code
   * Backend endpoint: POST /api/admin/promotions/validate
   * Custom endpoint không theo pattern CRUD chuẩn
   * 
   * Sử dụng custom() method từ BaseApiService
   */
  async validatePromoCode(payload: ValidatePromoRequest): Promise<PromotionEntity> {
    return this.custom<PromotionEntity>(
      'post',
      API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_VALIDATE,
      payload
    )
  }

  /**
   * GET active promotion count
   * Backend endpoint: GET /api/admin/promotions/active-count
   * Returns the count of active promotions (status=active, within date range, not exceeded usage limit)
   * 
   * Sử dụng custom() method từ BaseApiService
   */
  async getActivePromotionCount(): Promise<number> {
    return this.custom<number>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_ACTIVE_COUNT
    )
  }
}

export const promotionApiService = new PromotionApiService()

