import type { DiscountType, PromotionStatus } from '../../../config/api';

export interface PromotionEntity {
  id: number;
  promoCode: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  status: PromotionStatus;
}
