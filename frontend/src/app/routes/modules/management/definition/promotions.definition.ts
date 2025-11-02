import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition } from '../../../type/types';
import { PromotionManagementPage } from '../../../../../features/promotions/pages/PromotionManagementPage';
import { promotions as mockPromotions } from '../../../../../_mocks/promotions';

// 1. Định nghĩa Types và API
// --------------------------

interface PromotionLoaderData {
  promotions: (typeof mockPromotions);
  total: number;
}

const promotionSearchSchema = baseSearchSchema.extend({
  // type: z.enum(['discount', 'coupon', 'special_offer']).optional(),
  // status: z.enum(['active', 'expired', 'scheduled']).optional(),
  // startDate: z.string().optional(),
  // endDate: z.string().optional(),
});

export type PromotionSearch = z.infer<typeof promotionSearchSchema>;

async function fetchPromotions(search: PromotionSearch): Promise<PromotionLoaderData> {
  console.log('Fetching promotions with filters:', search);
  // Giả lập gọi API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    promotions: mockPromotions,
    total: mockPromotions.length,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const promotionAdminDefinition: ManagementRouteDefinition<
  PromotionLoaderData,     // Kiểu loader data
  PromotionSearch,         // Kiểu search params
  { apiClient: never }       // Kiểu router context (ví dụ)
> = {
  entityName: 'Khuyến mãi',
  path: 'promotions',
  component: PromotionManagementPage,
  searchSchema: promotionSearchSchema,
  loader: ({ search }) => fetchPromotions(search),
};