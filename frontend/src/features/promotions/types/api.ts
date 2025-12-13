import type { PagedRequest } from '../../../lib/api/axios.ts';
import type { DiscountType, PromotionStatus } from '../../../config/api.config.ts';
import type { PromotionEntity } from './entity.ts';

export interface CreatePromotionRequest {
  promoCode: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount?: number;
  usageLimit: number;
  status: PromotionStatus;
}

// UpdatePromotionRequest based on swagger.json - does NOT include usedCount
export interface UpdatePromotionRequest {
  promoCode: string;
  description?: string | null;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount?: number;
  usageLimit: number;
  status: PromotionStatus;
}

export interface PromotionFilterParams extends PagedRequest {
  status?: PromotionStatus;
}

export interface ValidatePromoRequest {
  promoCode: string;
  orderAmount: number;
}
