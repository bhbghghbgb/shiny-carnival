import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { ProductManagementPage } from '../../../../../features/products/pages/ProductManagementPage.tsx';
import { productApiService } from '../../../../../features/products/api';
import type { ProductEntity } from '../../../../../features/products/types/entity.ts';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';

// 1. Định nghĩa Types và API

interface ProductLoaderData {
  products: ProductEntity[];
  total: number;
}

const productSearchSchema = baseSearchSchema.extend({
  categoryId: z.number().optional(), // Filter theo category
  supplierId: z.number().optional(), // Filter theo supplier
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortField: z.string().catch('id'), // Default: 'id'
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'), // Default: 'descend'
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

async function fetchProducts(ctx: LoaderContext<Record<string, never>, ProductSearch, { apiClient: never }>): Promise<ProductLoaderData> {
  const search = ctx.search;
  console.log('🔍 [Loader] Fetching products with filters:', search);

  try {
    // Convert search params sang PagedRequest format (theo swagger.json)
    // Backend expect: Page, PageSize, Search, SortBy, SortDesc, CategoryId, SupplierId, MinPrice, MaxPrice (PascalCase)
    const params: PagedRequest = {
      page: search.page || 1,
      pageSize: search.pageSize || 10,
      search: search.search,
      // Convert sortField sang SortBy format của backend
      sortBy: search.sortField === 'productName' ? 'ProductName' :
              search.sortField === 'price' ? 'Price' :
              search.sortField === 'createdAt' ? 'CreatedAt' : 'Id',
      sortDesc: search.sortOrder === 'descend',
      // Add filters
      ...(search.categoryId !== undefined && { categoryId: search.categoryId }),
      ...(search.supplierId !== undefined && { supplierId: search.supplierId }),
      ...(search.minPrice !== undefined && { minPrice: search.minPrice }),
      ...(search.maxPrice !== undefined && { maxPrice: search.maxPrice }),
    };

    console.log('📤 [Loader] Calling API with params:', params);

    // Gọi API thật từ backend (productApiService.getPaginated tự động unwrap ApiResponse)
    const pagedList = await productApiService.getPaginated(params);

    console.log('📥 [Loader] PagedList:', pagedList);
    console.log('✅ [Loader] Successfully loaded products:', pagedList.items.length, 'total:', pagedList.totalCount);

    return {
      products: pagedList.items || [],
      total: pagedList.totalCount || 0,
    };
  } catch (error: unknown) {
    console.error('❌ [Loader] Exception caught:', error);

    // Log chi tiết error nếu có
    if (error && typeof error === 'object') {
      if ('message' in error) {
        console.error('❌ [Loader] Error message:', error.message);
      }
      if ('response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error('❌ [Loader] Axios error response data:', axiosError.response?.data);
        console.error('❌ [Loader] Axios error status:', axiosError.response?.status);
      }
      if ('stack' in error) {
        console.error('❌ [Loader] Error stack:', error.stack);
      }
    }

    return {
      products: [],
      total: 0,
    };
  }
}

// 2. Tạo "Bản thiết kế" cho trang quản trị

export const productAdminDefinition: ManagementRouteDefinition<
  ProductLoaderData,     // Kiểu loader data
  ProductSearch,         // Kiểu search params
  { apiClient: never }     // Kiểu router context (ví dụ)
> = {
  entityName: 'Sản phẩm',
  path: 'products',
  component: ProductManagementPage,
  searchSchema: productSearchSchema,
  loader: (ctx) => fetchProducts(ctx),
};