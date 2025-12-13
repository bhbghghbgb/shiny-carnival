import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
} from '../../../hooks/useApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApiService } from '../api/OrderApiService';
import type { OrderEntity } from '../types/entity';
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api';
import type { PagedRequest } from '../../../lib/api/types/api.types';
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory';

const ENTITY = 'orders';

/**
 * useOrders - GET all orders (không phân trang)
 */
export const useOrders = (params?: Record<string, unknown>) => {
  return useApiList<OrderEntity>({
    apiService: orderApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useOrdersPaginated - GET orders với phân trang
 */
export const useOrdersPaginated = (params?: PagedRequest) => {
  return useApiPaginated<OrderEntity>({
    apiService: orderApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useOrder - GET order by ID
 */
export const useOrder = (id: string | number) => {
  return useApiDetail<OrderEntity>({
    apiService: orderApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateOrder - POST create order
 */
export const useCreateOrder = (options?: Parameters<typeof useApiCreate<OrderEntity, CreateOrderRequest>>[0]['options']) => {
  return useApiCreate<OrderEntity, CreateOrderRequest>({
    apiService: orderApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdateOrderStatus - PATCH update order status
 * Sử dụng custom endpoint: PATCH /api/admin/orders/{id}/status
 */
export const useUpdateOrderStatus = (options?: {
  onSuccess?: (data: OrderEntity) => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  const queryKeys = createQueryKeys(ENTITY);

  const { onSuccess: userOnSuccess, onError: userOnError } = options || {};

  return useMutation<OrderEntity, Error, { id: number; data: UpdateOrderStatusRequest }>({
    mutationFn: async ({ id, data }) => {
      // Sử dụng method đặc biệt của OrderApiService (dựa trên BaseApiService.custom)
      return orderApiService.updateStatus(id, data);
    },
    onSuccess: (data, variables) => {
      // Invalidate tất cả list queries (bao gồm cả paginated)
      // queryKeys.lists() = ['orders', 'list'] sẽ match tất cả queries có prefix này
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      // Invalidate detail query
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
      
      userOnSuccess?.(data);
    },
    onError: (error) => {
      userOnError?.(error);
    },
  });
};

