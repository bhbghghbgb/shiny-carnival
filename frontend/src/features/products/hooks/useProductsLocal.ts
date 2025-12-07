import { usePaginationLocal } from '../../../hooks/usePaginationLocal';
import { productApiService } from '../api/ProductApiService';
import type { ProductEntity } from '../types/entity';
import type { PagedRequest } from '../../../lib/api/types/api.types';

/**
 * ProductFilters - Type cho advanced filters của Products
 */
export interface ProductFilters {
  categoryId?: number;
  supplierId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * useProductsLocal - Pagination với local state cho Products Modal/Drawer
 * 
 * Wrapper cho usePaginationLocal với productApiService
 * Hỗ trợ đầy đủ pagination, search, sort và advanced filters
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const pagination = useProductsLocal();
 * 
 * // With filters
 * const pagination = useProductsLocal({
 *   initialFilters: { categoryId: 1, inStock: true },
 * });
 * ```
 */
export const useProductsLocal = (config?: {
  initialParams?: Partial<PagedRequest>;
  initialFilters?: ProductFilters;
}) => {
  return usePaginationLocal<ProductEntity, ProductFilters>({
    apiService: productApiService,
    entity: 'products',
    initialParams: config?.initialParams,
    initialFilters: config?.initialFilters,
  });
};

