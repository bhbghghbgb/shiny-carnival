import type { PagedRequest } from '../../../lib/axios';
import type { DiscountType, PromotionStatus } from '../../../config/api';
import type { PromotionEntity } from './entity.ts';

export interface CreatePromotionRequest {
  promoCode: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  usageLimit: number;
  status: PromotionStatus;
}

export type UpdatePromotionRequest = PromotionEntity

export interface PromotionFilterParams extends PagedRequest {
  status?: PromotionStatus;
}
