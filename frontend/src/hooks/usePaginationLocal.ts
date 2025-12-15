import { useState, useMemo } from 'react';
import { useApiPaginated } from './useApi';
import type { BaseApiService } from '../lib/api/base';
import type { PagedRequest } from '../lib/api/types/api.types';

export interface UsePaginationLocalConfig<
  TData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFilters extends Record<string, any> = Record<string, any>
> {
  apiService: BaseApiService<TData>;
  entity: string;
  initialParams?: Partial<PagedRequest>;
  initialFilters?: TFilters;
}

/**
 * Hook quản lý pagination với local state (dùng cho Modal/Drawer)
 * 
 * Hỗ trợ đầy đủ pagination, search, sort và advanced filters.
 * Tương tự usePaginationWithRouter nhưng dùng useState thay vì URL.
 * 
 * @example
 * ```typescript
 * // Basic usage (không có filters)
 * const pagination = usePaginationLocal({
 *   apiService: productApiService,
 *   entity: 'products',
 *   initialParams: { sortBy: 'ProductName' },
 * });
 * 
 * // Advanced usage (với filters)
 * interface ProductFilters {
 *   categoryId?: number;
 *   minPrice?: number;
 *   maxPrice?: number;
 * }
 * 
 * const pagination = usePaginationLocal<ProductEntity, ProductFilters>({
 *   apiService: productApiService,
 *   entity: 'products',
 *   initialFilters: { categoryId: 1 },
 * });
 * ```
 */
export function usePaginationLocal<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFilters extends Record<string, any> = Record<string, any>
>({
  apiService,
  entity,
  initialParams = {},
  initialFilters = {} as TFilters,
}: UsePaginationLocalConfig<TData, TFilters>) {
  // Extract pagination params từ initialParams
  const {
    page: initialPage = 1,
    pageSize: initialPageSize = 20,
    search: initialSearch,
    sortBy: initialSortBy = 'id',
    sortDesc: initialSortDesc = false,
  } = initialParams;

  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState<string>(initialSearch || '');
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDesc, setSortDesc] = useState(initialSortDesc);

  // Filters state
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  // Build params - merge pagination + filters
  const params: PagedRequest & TFilters = useMemo(
    () => ({
      page,
      pageSize,
      search: search || undefined,
      sortBy,
      sortDesc,
      ...filters,
    }),
    [page, pageSize, search, sortBy, sortDesc, filters]
  );

  // Fetch data
  const { data, isLoading, ...query } = useApiPaginated<TData>({
    apiService,
    entity,
    params,
    options: {
      placeholderData: (previousData) => previousData,
      staleTime: 1000 * 60 * 5,
    },
  });

  // Actions
  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setPage(1);
    }
  };

  const handleSearch = (searchText: string) => {
    setSearch(searchText);
    setPage(1);
  };

  const handleSort = (field: string, descending: boolean) => {
    setSortBy(field);
    setSortDesc(descending);
    setPage(1);
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<TFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1); // Reset về page 1 khi filter thay đổi
  };

  const clearFilters = (filterKeys?: (keyof TFilters)[]) => {
    if (filterKeys && filterKeys.length > 0) {
      // Clear specific filters
      const clearedFilters: Partial<TFilters> = {};
      filterKeys.forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearedFilters[key] = undefined as any;
      });
      setFilters((prev) => ({
        ...prev,
        ...clearedFilters,
      }));
    } else {
      // Clear all filters
      setFilters(initialFilters);
    }
    setPage(1);
  };

  const resetPagination = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setSearch(initialSearch || '');
    setSortBy(initialSortBy);
    setSortDesc(initialSortDesc);
    setFilters(initialFilters);
  };

  // Extract filters từ params (loại bỏ pagination và sort params)
  const extractedFilters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page: _page, pageSize: _pageSize, search: _search, sortBy: _sortBy, sortDesc: _sortDesc, ...rest } = params;
    return rest as unknown as TFilters;
  }, [params]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(extractedFilters).filter(
      (v) => v !== undefined && v !== null && v !== ''
    ).length;
  }, [extractedFilters]);

  return {
    ...query,
    data,
    isLoading,
    // Pagination data
    params,
    page,
    pageSize,
    search,
    sortBy,
    sortDesc,
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    hasPrevious: data?.hasPrevious || false,
    hasNext: data?.hasNext || false,
    items: data?.items || [],
    // Filters
    filters: extractedFilters,
    activeFiltersCount,
    // Actions
    handlePageChange,
    handleSearch,
    handleSort,
    handleFilterChange,
    clearFilters,
    resetPagination,
    // Direct setters (nếu cần)
    setPage,
    setPageSize,
    setSearch,
    setSortBy,
    setSortDesc,
    setFilters,
  };
}

