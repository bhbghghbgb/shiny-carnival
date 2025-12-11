import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { PromotionManagementPage } from '../../../../../features/promotions/pages/PromotionManagementPage';
import { promotions as mockPromotions } from '../../../../../_mocks/promotions';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API
// --------------------------

const promotionSearchSchema = baseSearchSchema.extend({
  // type: z.enum(['discount', 'coupon', 'special_offer']).optional(),
  // status: z.enum(['active', 'expired', 'scheduled']).optional(),
  // startDate: z.string().optional(),
  // endDate: z.string().optional(),
});

export type PromotionSearch = z.infer<typeof promotionSearchSchema>;

async function fetchPromotions(ctx: LoaderContext<Record<string, never>, PromotionSearch, { queryClient: QueryClient }>): Promise<{ promotions: typeof mockPromotions; total: number }> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('promotions');
  const queryOpts = queryOptions<{ promotions: typeof mockPromotions; total: number }>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        promotions: mockPromotions,
        total: mockPromotions.length,
      };
    },
  });

  return context.queryClient.ensureQueryData(queryOpts);
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const promotionAdminDefinition: ManagementRouteDefinition<
  { promotions: typeof mockPromotions; total: number },     // Kiểu loader data
  PromotionSearch,         // Kiểu search params
  { queryClient: QueryClient }       // Kiểu router context
> = {
  entityName: 'Khuyến mãi',
  path: 'promotions',
  component: PromotionManagementPage,
  searchSchema: promotionSearchSchema,
  loader: (ctx) => fetchPromotions(ctx),
};