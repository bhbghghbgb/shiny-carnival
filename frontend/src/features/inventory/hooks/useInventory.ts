import {
  useApiList,
  useApiPaginated,
} from '../../../hooks/useApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApiService } from '../api/InventoryApiService';
import type { InventoryEntity } from '../types/inventoryEntity';
import type { UpdateInventoryRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory';

const ENTITY = 'inventory';

/**
 * useInventories - GET all inventories (không phân trang)
 */
export const useInventories = (params?: Record<string, unknown>) => {
  return useApiList<InventoryEntity>({
    apiService: inventoryApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useInventoriesPaginated - GET inventories với phân trang
 */
export const useInventoriesPaginated = (params?: PagedRequest) => {
  return useApiPaginated<InventoryEntity>({
    apiService: inventoryApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useInventory - GET inventory by productId
 * Sử dụng custom method getByProductId vì endpoint là /inventory/{productId} không phải /inventory/{id}
 */
export const useInventory = (productId: string | number) => {
  const queryKeys = createQueryKeys(ENTITY);
  
  return useQuery<InventoryEntity>({
    queryKey: queryKeys.detail(productId),
    queryFn: () => inventoryApiService.getByProductId(Number(productId)),
    enabled: !!productId,
  });
};

/**
 * useUpdateInventory - PATCH update inventory by productId
 * Sử dụng custom method updateByProductId vì endpoint là /inventory/{productId} không phải /inventory/{id}
 */
export const useUpdateInventory = (options?: {
  onSuccess?: (data: InventoryEntity) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(ENTITY);
  
  const { onSuccess: userOnSuccess, onError: userOnError } = options || {};

  return useMutation<InventoryEntity, Error, { productId: number; data: UpdateInventoryRequest }>({
    mutationFn: ({ productId, data }) => inventoryApiService.updateByProductId(productId, data),
    onSuccess: (data, variables) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      // Invalidate specific detail
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.productId) });
      
      userOnSuccess?.(data);
    },
    onError: userOnError,
  });
};

