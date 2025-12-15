import { usePaginationWithRouter } from '../../../hooks/usePaginationWithRouter';
import { userApiService } from '../api/UserApiService';
import type { UserEntity } from '../types/entity';

/**
 * useUsersWithRouter - Pagination với URL sync cho Users Page components
 * 
 * Wrapper cho usePaginationWithRouter với userApiService
 * Hỗ trợ đầy đủ pagination, search, sort và advanced filters
 * 
 * @example
 * ```typescript
 * const routeApi = getRouteApi('/admin/users');
 * const pagination = useUsersWithRouter({ routeApi });
 * ```
 */
export const useUsersWithRouter = (config: {
  routeApi: {
    useSearch: () => Record<string, unknown>;
  };
  additionalParams?: Record<string, unknown>;
}) => {
  return usePaginationWithRouter<UserEntity>({
    apiService: userApiService,
    entity: 'users',
    routeApi: config.routeApi,
    additionalParams: config.additionalParams,
  });
};

