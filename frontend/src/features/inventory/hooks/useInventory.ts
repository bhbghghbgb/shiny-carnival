import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiPatch,
} from '../../../hooks/useApi';
import { inventoryApiService } from '../api/InventoryApiService';
import type { InventoryEntity } from '../types/inventoryEntity';
import type { UpdateInventoryRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

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
 */
export const useInventory = (productId: string | number) => {
  return useApiDetail<InventoryEntity>({
    apiService: inventoryApiService,
    entity: ENTITY,
    id: productId,
  });
};

/**
 * useUpdateInventory - PATCH update inventory
 */
export const useUpdateInventory = (options?: Parameters<typeof useApiPatch<InventoryEntity, UpdateInventoryRequest>>[0]['options']) => {
  return useApiPatch<InventoryEntity, UpdateInventoryRequest>({
    apiService: inventoryApiService,
    entity: ENTITY,
    options,
  });
};

