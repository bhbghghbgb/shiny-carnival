import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { UserManagementPage } from '../../../../../features/users/pages/UserManagementPage.tsx';
import { userApiService } from '../../../../../features/users/api';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';
import { createPaginatedQueryOptions } from '../../../../../lib/query/queryOptionsFactory';
import type { QueryClient } from '@tanstack/react-query';

// 1. Định nghĩa Types và API

const userSearchSchema = baseSearchSchema.extend({
  role: z.number().optional(), // Filter theo role (client-side, backend không hỗ trợ)
  sortField: z.string().catch('createdAt'), // ✅ Default: 'createdAt'
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'), // ✅ Default: 'descend'
});

export type UserSearch = z.infer<typeof userSearchSchema>;

/**
 * Convert search params sang PagedRequest format cho backend
 */
function buildPagedRequest(search: UserSearch): PagedRequest {
  return {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    // Convert sortField sang SortBy format của backend
    sortBy: search.sortField === 'createdAt' ? 'CreatedAt' :
      search.sortField === 'username' ? 'Username' :
        search.sortField === 'fullName' ? 'FullName' : 'Id',
    sortDesc: search.sortOrder === 'descend',
  };
}

/**
 * Loader sử dụng TanStack Query để đảm bảo data có trong cache
 * 
 * Loader không trả về data trực tiếp, mà đảm bảo data đã được load vào cache.
 * Component sẽ sử dụng useSuspenseQuery để lấy data từ cache.
 */
async function fetchUsers(
  ctx: LoaderContext<Record<string, never>, UserSearch, { queryClient: QueryClient }>
): Promise<void> {
  const { search, context } = ctx;
  console.log('🔍 [Loader] Fetching users with filters:', search);

  try {
    // Convert search params sang PagedRequest format
    const params = buildPagedRequest(search);

    console.log('📤 [Loader] Calling API with params:', params);

    // Tạo query options sử dụng factory từ useApi logic
    const usersQueryOptions = createPaginatedQueryOptions(
      'users',
      userApiService,
      params
    );

    // Đảm bảo data có trong cache trước khi render
    // ensureQueryData sẽ fetch nếu chưa có trong cache, hoặc return cached data nếu đã có
    await context.queryClient.ensureQueryData(usersQueryOptions);

    console.log('✅ [Loader] Users data ensured in cache');
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

    // Re-throw error để TanStack Router xử lý
    throw error;
  }
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const userAdminDefinition: ManagementRouteDefinition<
  void,                // Loader không trả về data, chỉ ensure cache
  UserSearch,          // Kiểu search params
  { queryClient: QueryClient }  // Router context với queryClient
> = {
  entityName: 'Người dùng',
  path: 'users',
  component: UserManagementPage,
  searchSchema: userSearchSchema,
  loader: (ctx) => fetchUsers(ctx),
  allowedRoles: ['admin'], // Chỉ Admin được truy cập
};

// Export helper để component có thể tạo query options tương tự
export function createUsersQueryOptions(search: UserSearch) {
  const params = buildPagedRequest(search);
  return createPaginatedQueryOptions('users', userApiService, params);
}