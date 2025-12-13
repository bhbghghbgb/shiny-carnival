import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { CategoryManagementPage } from '../../../../../features/categories/pages/CategoryManagementPage';
import { categoryApiService } from '../../../../../features/categories/api';
import type { CategoryEntity } from '../../../../../features/categories/types/entity';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API

const categorySearchSchema = baseSearchSchema.extend({
  sortField: z.string().catch('id'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
});

export type CategorySearch = z.infer<typeof categorySearchSchema>;

function buildPagedRequest(search: CategorySearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'categoryName' ? 'CategoryName' : 'Id',
    sortDesc: search.sortOrder === 'descend',
  };
}

async function fetchCategories(ctx: LoaderContext<Record<string, never>, CategorySearch, { queryClient: QueryClient }>): Promise<{ categories: CategoryEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const categoriesQueryOptions = createPaginatedQueryOptions<CategoryEntity>(
    'categories',
    categoryApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(categoriesQueryOptions);

  return {
    categories: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const categoryAdminDefinition: ManagementRouteDefinition<
  { categories: CategoryEntity[]; total: number },
  CategorySearch,
  { queryClient: QueryClient }
> = {
  entityName: 'Danh mục',
  path: 'categories',
  component: CategoryManagementPage,
  searchSchema: categorySearchSchema,
  loader: (ctx) => fetchCategories(ctx),
};

export function createCategoriesQueryOptions(search: CategorySearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<CategoryEntity>('categories', categoryApiService, params);
}