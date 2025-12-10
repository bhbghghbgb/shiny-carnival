import { usePaginationLocal } from '../../../hooks/usePaginationLocal';
import { userApiService } from '../api/UserApiService';
import type { UserEntity } from '../types/entity';
import type { PagedRequest } from '../../../lib/api/types/api.types';
import type { UserRole } from '../../../config/api.config';

/**
 * UserFilters - Type cho advanced filters của Users
 */
export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
}

/**
 * useUsersLocal - Pagination với local state cho Users Modal/Drawer
 * 
 * Wrapper cho usePaginationLocal với userApiService
 * Hỗ trợ đầy đủ pagination, search, sort và advanced filters
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const pagination = useUsersLocal();
 * 
 * // With filters
 * const pagination = useUsersLocal({
 *   initialFilters: { role: 0 }, // Admin only
 * });
 * ```
 */
export const useUsersLocal = (config?: {
  initialParams?: Partial<PagedRequest>;
  initialFilters?: UserFilters;
}) => {
  return usePaginationLocal<UserEntity, UserFilters>({
    apiService: userApiService,
    entity: 'users',
    initialParams: config?.initialParams,
    initialFilters: config?.initialFilters,
  });
};

