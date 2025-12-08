import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { CategoryManagementPage } from '../../../../../features/categories/pages/CategoryManagementPage';
import { categories as mockCategories } from '../../../../../_mocks/categories';
import type { CategoryEntity } from '../../../../../features/categories/types/entity';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API
// --------------------------

const categorySearchSchema = baseSearchSchema.extend({
  // parentId: z.string().optional(),
  // level: z.number().optional(),
  // isActive: z.boolean().optional(),
});

export type CategorySearch = z.infer<typeof categorySearchSchema>;

async function fetchCategories(ctx: LoaderContext<Record<string, never>, CategorySearch, { queryClient: QueryClient }>): Promise<{ categories: CategoryEntity[]; total: number }> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('categories');
  const queryOpts = queryOptions<{ categories: CategoryEntity[]; total: number }>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        categories: mockCategories,
        total: mockCategories.length,
      };
    },
  });

  const data = await context.queryClient.ensureQueryData(queryOpts);
  return data;
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const categoryAdminDefinition: ManagementRouteDefinition<
  { categories: CategoryEntity[]; total: number },     // Kiểu loader data
  CategorySearch,         // Kiểu search params
  { queryClient: QueryClient }      // Kiểu router context
> = {
  entityName: 'Danh mục',
  path: 'categories',
  component: CategoryManagementPage,
  searchSchema: categorySearchSchema,
  loader: (ctx) => fetchCategories(ctx),
};