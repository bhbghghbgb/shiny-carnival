import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useApiPaginated } from './useApi';
import type { BaseApiService, QueryParams } from '../lib/api/base';
import type { PagedRequest } from '../lib/api/types/api.types';

export interface UsePaginationWithRouterConfig<TData> {
  apiService: BaseApiService<TData>;
  entity: string;
  routeApi: {
    useSearch: () => Record<string, unknown>;
  };
  additionalParams?: QueryParams;
}

/**
 * Hook quản lý pagination với URL sync cho Page components
 * 
 * Pagination state được lưu trong URL query params.
 * Hỗ trợ đầy đủ pagination, search, sort và advanced filters.
 * 
 * @example
 * ```typescript
 * const routeApi = getRouteApi('/admin/products');
 * const pagination = usePaginationWithRouter({
 *   apiService: productApiService,
 *   entity: 'products',
 *   routeApi,
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePaginationWithRouter<TData = any>({
  apiService,
  entity,
  routeApi,
  additionalParams = {},
}: UsePaginationWithRouterConfig<TData>) {
  const navigate = useNavigate();

  // Lấy search params từ URL
  const search = routeApi.useSearch();

  // Build params từ URL - Spread tất cả search params để lấy filters đặc biệt
  const params: PagedRequest & QueryParams = useMemo(() => {
    // Tách pagination params và filters từ search
    const {
      page,
      pageSize,
      search: searchText,
      sortBy,
      sortDesc,
      ...filters // Tất cả params còn lại là filters (categoryId, supplierId, minPrice, etc.)
    } = search as Record<string, unknown>;

    return {
      page: (typeof page === 'number' ? page : 1) as number,
      pageSize: (typeof pageSize === 'number' ? pageSize : 20) as number,
      search: (typeof searchText === 'string' ? searchText : undefined) as string | undefined,
      sortBy: (typeof sortBy === 'string' ? sortBy : 'id') as string,
      sortDesc: (sortDesc !== false) as boolean,
      ...filters, // ✅ Spread filters từ URL (categoryId, supplierId, minPrice, maxPrice, etc.)
      ...additionalParams, // Static params (override filters nếu cần)
    };
  }, [search, additionalParams]);

  // Fetch data
  const query = useApiPaginated<TData>({
    apiService,
    entity,
    params,
    options: {
      staleTime: 1000 * 60 * 5,
      placeholderData: (previousData) => previousData,
    },
  });

  // Update URL params - Generic function để update bất kỳ params nào
  const updateUrlParams = (newParams: Partial<PagedRequest & QueryParams>) => {
    navigate({
      // @ts-expect-error - TanStack Router type is too strict for dynamic search params
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        ...newParams,
      }),
    });
  };

  // Helper functions
  const handlePageChange = (newPage: number, newPageSize?: number) => {
    const updates: Partial<PagedRequest> = { page: newPage };
    if (newPageSize && newPageSize !== params.pageSize) {
      updates.pageSize = newPageSize;
      updates.page = 1;
    }
    updateUrlParams(updates);
  };

  const handleSearch = (searchText: string) => {
    updateUrlParams({
      search: searchText || undefined,
      page: 1,
    });
  };

  const handleSort = (field: string, descending: boolean) => {
    updateUrlParams({
      sortBy: field,
      sortDesc: descending,
      page: 1,
    });
  };

  // Handler để update filters đặc biệt
  const handleFilterChange = (newFilters: QueryParams) => {
    updateUrlParams({
      ...newFilters,
      page: 1, // Reset về page 1 khi filter thay đổi
    });
  };

  // Clear specific filters
  const clearFilters = (filterKeys?: string[]) => {
    if (filterKeys && filterKeys.length > 0) {
      // Clear specific filters
      const clearedFilters: Record<string, undefined> = {};
      filterKeys.forEach((key) => {
        clearedFilters[key] = undefined;
      });
      updateUrlParams({
        ...clearedFilters,
        page: 1,
      });
    } else {
      // Clear all filters (giữ pagination và sort)
      const searchParams = search as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page: _page, pageSize: _pageSize, search: _search, sortBy: _sortBy, sortDesc: _sortDesc, ...filters } = searchParams;
      const clearedFilters: Record<string, undefined> = {};
      Object.keys(filters).forEach((key) => {
        clearedFilters[key] = undefined;
      });
      updateUrlParams({
        ...clearedFilters,
        page: 1,
      });
    }
  };

  const resetPagination = () => {
    navigate({
      // @ts-expect-error - TanStack Router type is too strict for dynamic search params
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        page: 1,
        pageSize: 20,
      }),
    });
  };

  // Extract filters từ params (loại bỏ pagination và sort params)
  const filters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, pageSize, search, sortBy, sortDesc, ...rest } = params;
    return rest;
  }, [params]);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== ''
  ).length;

  return {
    ...query,
    params,
    filters, // Expose filters để component có thể sử dụng
    totalCount: query.data?.totalCount || 0,
    totalPages: query.data?.totalPages || 0,
    hasPrevious: query.data?.hasPrevious || false,
    hasNext: query.data?.hasNext || false,
    items: query.data?.items || [],
    activeFiltersCount, // Expose count để hiển thị badge
    handlePageChange,
    handleSearch,
    handleSort,
    handleFilterChange, // Handler để update filters
    clearFilters, // Clear filters
    resetPagination,
  };
}

