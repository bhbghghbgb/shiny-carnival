import { BaseApiService } from '../../../lib/api/base'
import axiosClient from '../../../lib/api/axios'
import { API_CONFIG } from '../../../config/api.config'
import type { CategoryEntity } from '../types/entity'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/api'

export class CategoryApiService extends BaseApiService<
  CategoryEntity,
  CreateCategoryRequest,
  UpdateCategoryRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES,
      axiosInstance: axiosClient,
    })
  }
}

export const categoryApiService = new CategoryApiService()


