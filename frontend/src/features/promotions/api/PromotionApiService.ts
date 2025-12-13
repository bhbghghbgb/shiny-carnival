import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api'

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
}

export const promotionApiService = new PromotionApiService()

