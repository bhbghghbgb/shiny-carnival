import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
} from '../../../hooks/useApi';
import { customerApiService } from '../api/CustomerApiService';
import type { CustomerEntity } from '../types/entity';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'customers';

/**
 * useCustomers - GET all customers (không phân trang)
 */
export const useCustomers = (params?: Record<string, unknown>) => {
  return useApiList<CustomerEntity>({
    apiService: customerApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useCustomersPaginated - GET customers với phân trang
 */
export const useCustomersPaginated = (params?: PagedRequest) => {
  return useApiPaginated<CustomerEntity>({
    apiService: customerApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useCustomer - GET customer by ID
 */
export const useCustomer = (id: string | number) => {
  return useApiDetail<CustomerEntity>({
    apiService: customerApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateCustomer - POST create customer
 */
export const useCreateCustomer = (options?: Parameters<typeof useApiCreate<CustomerEntity, CreateCustomerRequest>>[0]['options']) => {
  return useApiCreate<CustomerEntity, CreateCustomerRequest>({
    apiService: customerApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdateCustomer - PUT update customer
 */
export const useUpdateCustomer = (options?: Parameters<typeof useApiUpdate<CustomerEntity, UpdateCustomerRequest>>[0]['options']) => {
  return useApiUpdate<CustomerEntity, UpdateCustomerRequest>({
    apiService: customerApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useDeleteCustomer - DELETE customer
 */
export const useDeleteCustomer = (options?: Parameters<typeof useApiDelete<CustomerEntity>>[0]['options']) => {
  return useApiDelete<CustomerEntity>({
    apiService: customerApiService,
    entity: ENTITY,
    options,
  });
};

