import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { UserManagementPage } from '../../../../../features/users/pages/UserManagementPage.tsx';
import { userApiService } from '../../../../../features/users/api';
import type { UserNoPass } from '../../../../../features/users/types/entity.ts';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';

// 1. Định nghĩa Types và API

interface UserLoaderData {
  users: UserNoPass[];
  total: number;
}

const userSearchSchema = baseSearchSchema.extend({
  role: z.number().optional(), // Filter theo role (client-side, backend không hỗ trợ)
  sortField: z.string().catch('createdAt'), // ✅ Default: 'createdAt'
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'), // ✅ Default: 'descend'
});

export type UserSearch = z.infer<typeof userSearchSchema>;

async function fetchUsers(ctx: LoaderContext<Record<string, never>, UserSearch, { apiClient: never }>): Promise<UserLoaderData> {
  const search = ctx.search;
  console.log('🔍 [Loader] Fetching users with filters:', search);

  try {
    // Convert search params sang PagedRequest format (theo swagger.json)
    // Backend expect: Page, PageSize, Search, SortBy, SortDesc (PascalCase)
    const params: PagedRequest = {
      page: search.page || 1,
      pageSize: search.pageSize || 10,
      search: search.search,
      // Convert sortField sang SortBy format của backend
      sortBy: search.sortField === 'createdAt' ? 'CreatedAt' :
        search.sortField === 'username' ? 'Username' :
          search.sortField === 'fullName' ? 'FullName' : 'Id',
      sortDesc: search.sortOrder === 'descend',
    };

    console.log('📤 [Loader] Calling API with params:', params);

    // Gọi API thật từ backend (userApiService.getPaginated tự động unwrap ApiResponse)
    const pagedList = await userApiService.getPaginated(params);

    console.log('📥 [Loader] PagedList:', pagedList);

    // Backend đã trả về UserNoPass (không có password)
    let users: UserNoPass[] = pagedList.items || [];

    // Filter theo role ở client-side (backend không hỗ trợ role filter trong query params)
    if (search.role !== undefined) {
      users = users.filter((user: UserNoPass) => user.role === search.role);
    }

    console.log('✅ [Loader] Successfully loaded users:', users.length, 'total:', pagedList.totalCount);

    return {
      users,
      total: pagedList.totalCount || users.length,
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
      users: [],
      total: 0,
    };
  }
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const userAdminDefinition: ManagementRouteDefinition<
  UserLoaderData,     // Kiểu loader data
  UserSearch,         // Kiểu search params
  { apiClient: never }  // Kiểu router context (ví dụ)
> = {
  entityName: 'Người dùng',
  path: 'users',
  component: UserManagementPage,
  searchSchema: userSearchSchema,
  loader: (ctx) => fetchUsers(ctx),
};