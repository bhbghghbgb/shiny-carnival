import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { PromotionManagementPage } from '../../../../../features/promotions/pages/PromotionManagementPage';
import { promotionApiService } from '../../../../../features/promotions/api/PromotionApiService';
import type { PromotionEntity } from '../../../../../features/promotions/types/entity';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API

const promotionSearchSchema = baseSearchSchema.extend({
  sortField: z.string().catch('id'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
  status: z.enum(['active', 'inactive']).optional(),
});

export type PromotionSearch = z.infer<typeof promotionSearchSchema>;

function buildPagedRequest(search: PromotionSearch): PagedRequest & { status?: string } {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'promoCode' ? 'PromoCode' :
      search.sortField === 'startDate' ? 'StartDate' : 'Id',
    sortDesc: search.sortOrder === 'descend',
    status: search.status,
  };
}

async function fetchPromotions(ctx: LoaderContext<Record<string, never>, PromotionSearch, { queryClient: QueryClient }>): Promise<{ promotions: PromotionEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const promotionsQueryOptions = createPaginatedQueryOptions<PromotionEntity>(
    'promotions',
    promotionApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(promotionsQueryOptions);

  return {
    promotions: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const promotionAdminDefinition: ManagementRouteDefinition<
  { promotions: PromotionEntity[]; total: number },
  PromotionSearch,
  { queryClient: QueryClient }
> = {
  entityName: 'Khuyến mãi',
  path: 'promotions',
  component: PromotionManagementPage,
  searchSchema: promotionSearchSchema,
  loader: (ctx) => fetchPromotions(ctx),
  allowedRoles: ['admin'], // Chỉ Admin được truy cập
};

export function createPromotionsQueryOptions(search: PromotionSearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<PromotionEntity>('promotions', promotionApiService, params);
}