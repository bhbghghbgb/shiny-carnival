import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
} from '../../../hooks/useApi';
import { promotionApiService } from '../api/PromotionApiService';
import type { PromotionEntity } from '../types/entity';
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'promotions';

/**
 * usePromotions - GET all promotions (không phân trang)
 */
export const usePromotions = (params?: Record<string, unknown>) => {
  return useApiList<PromotionEntity>({
    apiService: promotionApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * usePromotionsPaginated - GET promotions với phân trang
 */
export const usePromotionsPaginated = (params?: PagedRequest) => {
  return useApiPaginated<PromotionEntity>({
    apiService: promotionApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * usePromotion - GET promotion by ID
 */
export const usePromotion = (id: string | number) => {
  return useApiDetail<PromotionEntity>({
    apiService: promotionApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreatePromotion - POST create promotion
 */
export const useCreatePromotion = (options?: Parameters<typeof useApiCreate<PromotionEntity, CreatePromotionRequest>>[0]['options']) => {
  return useApiCreate<PromotionEntity, CreatePromotionRequest>({
    apiService: promotionApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdatePromotion - PUT update promotion
 */
export const useUpdatePromotion = (options?: Parameters<typeof useApiUpdate<PromotionEntity, UpdatePromotionRequest>>[0]['options']) => {
  return useApiUpdate<PromotionEntity, UpdatePromotionRequest>({
    apiService: promotionApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useDeletePromotion - DELETE promotion
 */
export const useDeletePromotion = (options?: Parameters<typeof useApiDelete<PromotionEntity>>[0]['options']) => {
  return useApiDelete<PromotionEntity>({
    apiService: promotionApiService,
    entity: ENTITY,
    options,
  });
};

