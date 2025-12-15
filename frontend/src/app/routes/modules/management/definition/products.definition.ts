import { z } from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { ProductManagementPage } from '../../../../../features/products/pages/ProductManagementPage.tsx';
import { productApiService } from '../../../../../features/products/api';
import type { ProductEntity } from '../../../../../features/products/types/entity.ts';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import type { QueryClient } from '@tanstack/react-query';
import { createPaginatedQueryOptions, createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API

const productSearchSchema = baseSearchSchema.extend({
  categoryId: z.number().optional(), // Filter theo category
  supplierId: z.number().optional(), // Filter theo supplier
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  onlyLowStock: z.boolean().optional(), // Filter chỉ sản phẩm tồn kho thấp
  sortField: z.string().catch('id'), // Default: 'id'
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'), // Default: 'descend'
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

function buildPagedRequest(search: ProductSearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'productName' ? 'ProductName' :
      search.sortField === 'price' ? 'Price' :
        search.sortField === 'createdAt' ? 'CreatedAt' : 'Id',
    sortDesc: search.sortOrder === 'descend',
    ...(search.categoryId !== undefined && { categoryId: search.categoryId }),
    ...(search.supplierId !== undefined && { supplierId: search.supplierId }),
    ...(search.minPrice !== undefined && { minPrice: search.minPrice }),
    ...(search.maxPrice !== undefined && { maxPrice: search.maxPrice }),
    ...(search.onlyLowStock !== undefined && { onlyLowStock: search.onlyLowStock }),
  };
}

async function fetchProducts(ctx: LoaderContext<Record<string, never>, ProductSearch, { queryClient: QueryClient }>): Promise<{ products: ProductEntity[]; total: number }> {
  const { search, context } = ctx;
  const params = buildPagedRequest(search);

  const productsQueryOptions = createPaginatedQueryOptions<ProductEntity>(
    'products',
    productApiService,
    params,
  );

  const data = await context.queryClient.ensureQueryData(productsQueryOptions);

  return {
    products: data.items || [],
    total: data.totalCount || (data.items ? data.items.length : 0),
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị

export const productAdminDefinition: ManagementRouteDefinition<
  { products: ProductEntity[]; total: number },     // Kiểu loader data
  ProductSearch,         // Kiểu search params
  { queryClient: QueryClient }     // Kiểu router context
> = {
  entityName: 'Sản phẩm',
  path: 'products',
  component: ProductManagementPage,
  searchSchema: productSearchSchema,
  loader: (ctx) => fetchProducts(ctx),
  allowedRoles: ['admin', 'staff'], // Admin và Staff đều truy cập được
};

export function createProductsQueryOptions(search: ProductSearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions<ProductEntity>('products', productApiService, params);
}