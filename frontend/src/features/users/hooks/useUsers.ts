import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
  useApiCustomQuery,
} from '../../../hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { userApiService } from '../api/UserApiService';
import type { UserEntity } from '../types/entity';
import type { CreateUserRequest, UpdateUserRequest } from '../types/api';
import type { PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'users';

/**
 * useUsers - GET all users (không phân trang)
 * 
 * @param params - Query params (filter, search, etc.)
 * @returns Query result với data là UserEntity[]
 */
export const useUsers = (params?: Record<string, unknown>) => {
  return useApiList<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useUsersPaginated - GET users với phân trang
 * 
 * @param params - PagedRequest
 * @returns Query result với data là PagedList<UserEntity>
 */
export const useUsersPaginated = (params?: PagedRequest) => {
  return useApiPaginated<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useUser - GET user by ID
 * 
 * @param id - User ID
 * @returns Query result với data là UserEntity
 */
export const useUser = (id: string | number) => {
  return useApiDetail<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateUser - POST create user
 * 
 * @param options - TanStack Query mutation options
 * @returns Mutation result
 */
export const useCreateUser = (options?: Parameters<typeof useApiCreate<UserEntity, CreateUserRequest>>[0]['options']) => {
  return useApiCreate<UserEntity, CreateUserRequest>({
    apiService: userApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdateUser - PUT update user
 * 
 * @param options - TanStack Query mutation options
 * @returns Mutation result
 */
export const useUpdateUser = (options?: Parameters<typeof useApiUpdate<UserEntity, UpdateUserRequest>>[0]['options']) => {
  return useApiUpdate<UserEntity, UpdateUserRequest>({
    apiService: userApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useDeleteUser - DELETE user
 * 
 * @param options - TanStack Query mutation options
 * @returns Mutation result
 */
export const useDeleteUser = (options?: Parameters<typeof useApiDelete<UserEntity>>[0]['options']) => {
  return useApiDelete<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useStaffUsers - GET staff users (dùng cho dropdown)
 * 
 * @param params - Pagination params
 * @returns Query result với data là UserEntity[]
 */
export const useStaffUsers = (params?: PagedRequest) => {
  return useQuery<UserEntity[]>({
    queryKey: [ENTITY, 'staff', params],
    queryFn: () => userApiService.getStaffUsers(params),
  });
};

/**
 * useCheckUsernameExists - Check username exists
 * 
 * @param username - Username cần kiểm tra
 * @returns Query result với data là boolean
 */
export const useCheckUsernameExists = (username: string) => {
  return useQuery<boolean>({
    queryKey: [ENTITY, 'check-username', username],
    queryFn: () => userApiService.checkUsernameExists(username),
    enabled: username.length > 0,
  });
};

