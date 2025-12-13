import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
} from '../../../hooks/useApi';
import { orderApiService } from '../api/OrderApiService';
import type { OrderEntity } from '../types/entity';
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

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
 */
export const useUpdateOrderStatus = (options?: Parameters<typeof useApiUpdate<OrderEntity, UpdateOrderStatusRequest>>[0]['options']) => {
  return useApiUpdate<OrderEntity, UpdateOrderStatusRequest>({
    apiService: orderApiService,
    entity: ENTITY,
    options,
  });
};

