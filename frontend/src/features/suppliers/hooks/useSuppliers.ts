import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
} from '../../../hooks/useApi';
import { supplierApiService } from '../api/SupplierApiService';
import type { SupplierEntity } from '../types/entity';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'suppliers';

/**
 * useSuppliers - GET all suppliers (không phân trang)
 */
export const useSuppliers = (params?: Record<string, unknown>) => {
  return useApiList<SupplierEntity>({
    apiService: supplierApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useSuppliersPaginated - GET suppliers với phân trang
 */
export const useSuppliersPaginated = (params?: PagedRequest) => {
  return useApiPaginated<SupplierEntity>({
    apiService: supplierApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useSupplier - GET supplier by ID
 */
export const useSupplier = (id: string | number) => {
  return useApiDetail<SupplierEntity>({
    apiService: supplierApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateSupplier - POST create supplier
 */
export const useCreateSupplier = (options?: Parameters<typeof useApiCreate<SupplierEntity, CreateSupplierRequest>>[0]['options']) => {
  return useApiCreate<SupplierEntity, CreateSupplierRequest>({
    apiService: supplierApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdateSupplier - PUT update supplier
 */
export const useUpdateSupplier = (options?: Parameters<typeof useApiUpdate<SupplierEntity, UpdateSupplierRequest>>[0]['options']) => {
  return useApiUpdate<SupplierEntity, UpdateSupplierRequest>({
    apiService: supplierApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useDeleteSupplier - DELETE supplier
 */
export const useDeleteSupplier = (options?: Parameters<typeof useApiDelete<SupplierEntity>>[0]['options']) => {
  return useApiDelete<SupplierEntity>({
    apiService: supplierApiService,
    entity: ENTITY,
    options,
  });
};

