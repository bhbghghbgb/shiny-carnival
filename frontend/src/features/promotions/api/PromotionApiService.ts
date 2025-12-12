import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest, ValidatePromoRequest } from '../types/api'
import type { ApiResponse } from '../../../lib/api/types/api.types'
import { unwrapResponse } from '../../../lib/api/base/apiResponseAdapter'

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
   */
  async validatePromoCode(payload: ValidatePromoRequest): Promise<PromotionEntity> {
    const response = await this.axios.post<ApiResponse<PromotionEntity>>(
      API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_VALIDATE,
      payload
    )
    return unwrapResponse(response.data)
  }
}

export const promotionApiService = new PromotionApiService()

