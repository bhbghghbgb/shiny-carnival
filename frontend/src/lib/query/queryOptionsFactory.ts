import { queryOptions } from '@tanstack/react-query';
import type { BaseApiService, QueryParams } from '../api/base';
import type { PagedList, PagedRequest } from '../api/types/api.types';

/**
 * Query Key Factory - Tạo cấu trúc query keys phân cấp cho TanStack Query
 */
export const createQueryKeys = (entity: string) => ({
  all: [entity] as const,
  lists: () => [...createQueryKeys(entity).all, 'list'] as const,
  list: (params?: QueryParams) =>
    [...createQueryKeys(entity).lists(), params] as const,
  details: () => [...createQueryKeys(entity).all, 'detail'] as const,
  detail: (id: string | number) =>
    [...createQueryKeys(entity).details(), id] as const,
});

/**
 * Query Options Factory - Tạo queryOptions để sử dụng trong loaders và components
 * 
 * Tái sử dụng logic từ useApi.ts nhưng trả về queryOptions thay vì hooks
 * để có thể sử dụng trong loaders với ensureQueryData
 */

/**
 * Tạo query options cho paginated list
 * 
 * @param entity - Tên entity (ví dụ: 'users', 'products')
 * @param apiService - ApiService instance
 * @param params - PagedRequest parameters
 * @returns QueryOptions cho useSuspenseQuery hoặc ensureQueryData
 * 
 * @example
 * ```typescript
 * const usersQueryOptions = createPaginatedQueryOptions(
 *   'users',
 *   userApiService,
 *   { page: 1, pageSize: 10 }
 * );
 * 
 * // Trong loader:
 * await context.queryClient.ensureQueryData(usersQueryOptions);
 * 
 * // Trong component:
 * const { data } = useSuspenseQuery(usersQueryOptions);
 * ```
 */
export function createPaginatedQueryOptions<TData = unknown>(
  entity: string,
  apiService: BaseApiService<TData>,
  params?: PagedRequest
) {
  const queryKeys = createQueryKeys(entity);

  return queryOptions<PagedList<TData>>({
    queryKey: [...queryKeys.lists(), 'paginated', params],
    queryFn: async () => {
      try {
        console.log(`🔍 [QueryFactory] Fetching ${entity} with params:`, params);
        const result = await apiService.getPaginated(params);
        console.log(`✅ [QueryFactory] Successfully fetched ${entity}:`, result);
        return result;
      } catch (error) {
        console.error(`❌ [QueryFactory] Error fetching ${entity}:`, {
          entity,
          params,
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
          errorDetails: error,
        });
        // Re-throw để TanStack Query có thể handle
        throw error;
      }
    },
    placeholderData: (previousData) => previousData, // Giữ data cũ khi fetch trang mới
  });
}

/**
 * Tạo query options cho list (không phân trang)
 * 
 * @param entity - Tên entity
 * @param apiService - ApiService instance
 * @param params - QueryParams
 * @returns QueryOptions
 */
export function createListQueryOptions<TData = unknown>(
  entity: string,
  apiService: BaseApiService<TData>,
  params?: QueryParams
) {
  const queryKeys = createQueryKeys(entity);

  return queryOptions<TData[]>({
    queryKey: queryKeys.list(params),
    queryFn: () => apiService.getAll(params),
  });
}

/**
 * Tạo query options cho detail (get by id)
 * 
 * @param entity - Tên entity
 * @param apiService - ApiService instance
 * @param id - ID của item
 * @returns QueryOptions
 */
export function createDetailQueryOptions<TData = unknown>(
  entity: string,
  apiService: BaseApiService<TData>,
  id: string | number
) {
  const queryKeys = createQueryKeys(entity);

  return queryOptions<TData>({
    queryKey: queryKeys.detail(id),
    queryFn: () => apiService.getById(id),
    enabled: !!id,
  });
}

