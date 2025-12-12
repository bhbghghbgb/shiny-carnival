import { usePaginationWithRouter } from '../../../hooks/usePaginationWithRouter';
import { productApiService } from '../api/ProductApiService';
import type { ProductEntity } from '../types/entity';

/**
 * useProductsWithRouter - Pagination với URL sync cho Products Page components
 * 
 * Wrapper cho usePaginationWithRouter với productApiService
 * Hỗ trợ đầy đủ pagination, search, sort và advanced filters
 * 
 * @example
 * ```typescript
 * const routeApi = getRouteApi('/admin/products');
 * const pagination = useProductsWithRouter({ routeApi });
 * ```
 */
export const useProductsWithRouter = (config: {
  routeApi: {
    useSearch: () => Record<string, unknown>;
  };
  additionalParams?: Record<string, unknown>;
}) => {
  return usePaginationWithRouter<ProductEntity>({
    apiService: productApiService,
    entity: 'products',
    routeApi: config.routeApi,
    additionalParams: config.additionalParams,
  });
};

