import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition } from '../../../type/types';
import { CategoryManagementPage } from '../../../../../features/categories/pages/CategoryManagementPage';
import { categories as mockCategories } from '../../../../../_mocks/categories';
import type { CategoryEntity } from '../../../../../features/categories/types/entity';

// 1. Định nghĩa Types và API
// --------------------------

interface CategoryLoaderData {
  categories: CategoryEntity[];
  total: number;
}

const categorySearchSchema = baseSearchSchema.extend({
  // parentId: z.string().optional(),
  // level: z.number().optional(),
  // isActive: z.boolean().optional(),
});

export type CategorySearch = z.infer<typeof categorySearchSchema>;

async function fetchCategories(search: CategorySearch): Promise<CategoryLoaderData> {
  console.log('Fetching categories with filters:', search);
  // Giả lập gọi API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    categories: mockCategories,
    total: mockCategories.length,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const categoryAdminDefinition: ManagementRouteDefinition<
  CategoryLoaderData,     // Kiểu loader data
  CategorySearch,         // Kiểu search params
  { apiClient: never }      // Kiểu router context (ví dụ)
> = {
  entityName: 'Danh mục',
  path: '/admin/categories',
  component: CategoryManagementPage,
  searchSchema: categorySearchSchema,
  loader: ({ search }) => fetchCategories(search),
};