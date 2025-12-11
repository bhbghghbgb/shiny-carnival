import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import type { BaseApiService, QueryParams } from '../lib/api/base';
import type { PagedList, PagedRequest } from '../lib/api/types/api.types';
import {
  createQueryKeys,
  createDetailQueryOptions,
  createListQueryOptions,
  createPaginatedQueryOptions,
} from '../lib/query/queryOptionsFactory';

// ==================== Hook Configuration Types ====================
export interface UseApiListConfig<TData, TError = Error> {
  apiService: BaseApiService<TData>;
  entity: string;
  params?: QueryParams;
  options?: Omit<
    UseQueryOptions<TData[], TError, TData[], QueryKey>,
    'queryKey' | 'queryFn'
  >;
}

export interface UseApiPaginatedConfig<TData, TError = Error> {
  apiService: BaseApiService<TData>;
  entity: string;
  params?: PagedRequest;
  options?: Omit<
    UseQueryOptions<PagedList<TData>, TError, PagedList<TData>, QueryKey>,
    'queryKey' | 'queryFn'
  >;
}

export interface UseApiDetailConfig<TData, TError = Error> {
  apiService: BaseApiService<TData>;
  entity: string;
  id: string | number;
  options?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >;
}

export interface UseApiMutationConfig<TData, TVariables, TError = Error> {
  apiService: BaseApiService<TData>;
  entity: string;
  invalidateQueries?: string[];
  options?: UseMutationOptions<TData, TError, TVariables>;
}

// ==================== GET ALL Hook ====================
/**
 * useApiList - Hook để fetch danh sách items (GET all, không phân trang)
 * 
 * @returns Query result từ useQuery với data là TData[]
 */
export function useApiList<TData = unknown, TError = Error>({
  apiService,
  entity,
  params,
  options,
}: UseApiListConfig<TData, TError>) {
  const queryOpts = createListQueryOptions<TData>(entity, apiService, params);
  const mergedOptions = {
    ...queryOpts,
    ...(options ?? {}),
  } as UseQueryOptions<TData[], TError, TData[], QueryKey>;

  return useQuery<TData[], TError>(mergedOptions);
}

// ==================== GET PAGINATED Hook ====================
/**
 * useApiPaginated - Hook để fetch danh sách có phân trang
 * 
 * Core hook cho pagination, không quản lý state.
 * Sử dụng placeholderData để giữ data cũ khi đang fetch trang mới.
 * 
 * @returns Query result từ useQuery với data là PagedList<TData>
 */
export function useApiPaginated<TData = unknown, TError = Error>({
  apiService,
  entity,
  params,
  options,
}: UseApiPaginatedConfig<TData, TError>) {
  const queryOpts = createPaginatedQueryOptions<TData>(entity, apiService, params);
  const mergedOptions = {
    ...queryOpts,
    ...(options ?? {}),
  } as UseQueryOptions<PagedList<TData>, TError, PagedList<TData>, QueryKey>;

  return useQuery<PagedList<TData>, TError>(mergedOptions);
}

// ==================== GET BY ID Hook ====================
/**
 * useApiDetail - Hook để fetch một item cụ thể theo ID
 * 
 * Tự động disable khi id là falsy.
 * 
 * @returns Query result từ useQuery với data là TData
 */
export function useApiDetail<TData = unknown, TError = Error>({
  apiService,
  entity,
  id,
  options,
}: UseApiDetailConfig<TData, TError>) {
  const queryOpts = createDetailQueryOptions<TData>(entity, apiService, id);
  const mergedOptions = {
    ...queryOpts,
    ...(options ?? {}),
  } as UseQueryOptions<TData, TError, TData, QueryKey>;

  return useQuery<TData, TError>(mergedOptions);
}

// ==================== CREATE Hook ====================
/**
 * useApiCreate - Hook để tạo mới một item (POST)
 * 
 * Tự động invalidate tất cả list queries sau khi tạo thành công.
 * 
 * @returns Mutation result từ useMutation
 */
export function useApiCreate<
  TData = unknown,
  TCreate = unknown,
  TError = Error
>({
  apiService,
  entity,
  invalidateQueries = [],
  options,
}: UseApiMutationConfig<TData, TCreate, TError>) {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(entity);

  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options || {};

  return useMutation<TData, TError, TCreate>({
    mutationFn: (data: TCreate) => apiService.create(data),
    onSuccess: (data, variables, context) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

      // Invalidate additional queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Call user's onSuccess if provided
      if (userOnSuccess) {
        // @ts-expect-error - TanStack Query onSuccess signature may vary by version
        userOnSuccess(data, variables, context);
      }
    },
    onError: userOnError,
    ...restOptions,
  });
}

// ==================== UPDATE Hook ====================
/**
 * useApiUpdate - Hook để cập nhật toàn bộ một item (PUT)
 * 
 * Variables format: { id: string | number, data: TUpdate }
 * 
 * Tự động invalidate list queries và detail query của item vừa update.
 * 
 * @returns Mutation result từ useMutation
 */
export function useApiUpdate<
  TData = unknown,
  TUpdate = unknown,
  TError = Error
>({
  apiService,
  entity,
  invalidateQueries = [],
  options,
}: UseApiMutationConfig<TData, { id: string | number; data: TUpdate }, TError>) {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(entity);

  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options || {};

  return useMutation<TData, TError, { id: string | number; data: TUpdate }>({
    mutationFn: ({ id, data }) => apiService.update(id, data),
    onSuccess: (data, variables, context) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

      // Invalidate specific detail
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });

      // Invalidate additional queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // @ts-expect-error - TanStack Query onSuccess signature may vary by version
      userOnSuccess?.(data, variables, context);
    },
    onError: userOnError,
    ...restOptions,
  });
}

// ==================== PATCH Hook ====================
/**
 * useApiPatch - Hook để cập nhật một phần item (PATCH)
 * 
 * Variables format: { id: string | number, data: Partial<TUpdate> }
 * 
 * Tự động invalidate list queries và detail query của item vừa update.
 * 
 * @returns Mutation result từ useMutation
 */
export function useApiPatch<
  TData = unknown,
  TUpdate = unknown,
  TError = Error
>({
  apiService,
  entity,
  invalidateQueries = [],
  options,
}: UseApiMutationConfig<TData, { id: string | number; data: Partial<TUpdate> }, TError>) {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(entity);

  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options || {};

  return useMutation<TData, TError, { id: string | number; data: Partial<TUpdate> }>({
    mutationFn: ({ id, data }) => apiService.patch(id, data),
    onSuccess: (data, variables, context) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

      // Invalidate specific detail
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });

      // Invalidate additional queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // @ts-expect-error - TanStack Query onSuccess signature may vary by version
      userOnSuccess?.(data, variables, context);
    },
    onError: userOnError,
    ...restOptions,
  });
}

// ==================== DELETE Hook ====================
/**
 * useApiDelete - Hook để xóa một item (DELETE)
 * 
 * Variables format: string | number (id của item)
 * 
 * Tự động invalidate list queries và remove detail query của item vừa xóa.
 * 
 * @returns Mutation result từ useMutation
 */
export function useApiDelete<TData = unknown, TError = Error>({
  apiService,
  entity,
  invalidateQueries = [],
  options,
}: UseApiMutationConfig<TData, string | number, TError>) {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(entity);

  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options || {};

  return useMutation<void, TError, string | number>({
    // @ts-expect-error - delete() always returns Promise<void> but TypeScript infers it from TData generic
    mutationFn: (id: string | number) => apiService.delete(id),
    onSuccess: (data, id, context) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

      // Remove specific detail query (không còn tồn tại sau khi xóa)
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) });

      // Invalidate additional queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // @ts-expect-error - TanStack Query onSuccess signature may vary by version
      userOnSuccess?.(data, id, context);
    },
    onError: userOnError,
    ...restOptions,
  });
}

// ==================== CUSTOM QUERY Hook ====================
/**
 * useApiCustomQuery - Hook cho custom queries
 * 
 * Cho phép logic query tùy chỉnh, vẫn tận dụng query keys & cache.
 * 
 * @param apiService - ApiService instance (type không cần khớp với return type)
 * @param entity - Tên entity
 * @param queryKey - Custom query key (sẽ được prepend với entity key)
 * @param queryFn - Custom query function
 * @param options - TanStack Query options
 * @returns Query result từ useQuery
 */
export function useApiCustomQuery<TData = unknown, TError = Error>({
  entity,
  queryKey,
  queryFn,
  options,
}: {
  entity: string;
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>;
}) {
  const queryKeys = createQueryKeys(entity);
  const fullQueryKey = [...queryKeys.all, ...queryKey];

  return useQuery<TData, TError>({
    queryKey: fullQueryKey,
    queryFn,
    ...options,
  });
}

// ==================== CUSTOM MUTATION Hook ====================
/**
 * useApiCustomMutation - Hook cho custom mutations
 * 
 * Cho phép logic mutation tùy chỉnh, vẫn tận dụng query keys & cache invalidation.
 * 
 * @param apiService - ApiService instance
 * @param entity - Tên entity
 * @param mutationFn - Custom mutation function
 * @param invalidateQueries - Query keys cần invalidate sau khi thành công
 * @param options - TanStack Query mutation options
 * @returns Mutation result từ useMutation
 */
export function useApiCustomMutation<
  TData = unknown,
  TVariables = unknown,
  TError = Error
>({
  entity,
  mutationFn,
  invalidateQueries = [],
  options,
}: {
  entity: string;
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateQueries?: string[];
  options?: UseMutationOptions<TData, TError, TVariables>;
}) {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(entity);

  const { onSuccess: userOnSuccess, onError: userOnError, ...restOptions } = options || {};

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

      // Invalidate additional queries
      invalidateQueries.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      // Call user's onSuccess if provided
      if (userOnSuccess) {
        // @ts-expect-error - TanStack Query onSuccess signature may vary by version
        userOnSuccess(data, variables, context);
      }
    },
    onError: userOnError,
    ...restOptions,
  });
}

