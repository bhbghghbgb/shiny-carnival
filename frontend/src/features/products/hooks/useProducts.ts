import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiPatch,
  useApiDelete,
  useApiCustomQuery,
} from '../../../hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { productApiService } from '../api/ProductApiService';
import type { ProductEntity } from '../types/entity';
import type { CreateProductRequest, UpdateProductRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'products';

/**
 * useProducts - GET all products (không phân trang)
 * 
 * @param params - Query params (filter, search, etc.)
 * @returns Query result với data là ProductEntity[]
 */
export const useProducts = (params?: Record<string, unknown>) => {
  return useApiList<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useProductsPaginated - GET products với phân trang
 * 
 * @param params - PagedRequest
 * @returns Query result với data là PagedList<ProductEntity>
 */
export const useProductsPaginated = (params?: PagedRequest) => {
  return useApiPaginated<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useProduct - GET product by ID
 * 
 * @param id - Product ID
 * @returns Query result với data là ProductEntity
 */
export const useProduct = (id: string | number) => {
  return useApiDetail<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateProduct - POST create product
 * 
 * @returns Mutation result
 */
export const useCreateProduct = () => {
  return useApiCreate<ProductEntity, CreateProductRequest>({
    apiService: productApiService,
    entity: ENTITY,
  });
};

/**
 * useUpdateProduct - PUT update product
 * 
 * @returns Mutation result
 */
export const useUpdateProduct = () => {
  return useApiUpdate<ProductEntity, UpdateProductRequest>({
    apiService: productApiService,
    entity: ENTITY,
  });
};

/**
 * usePatchProduct - PATCH partial update product
 * 
 * @returns Mutation result
 */
export const usePatchProduct = () => {
  return useApiPatch<ProductEntity, UpdateProductRequest>({
    apiService: productApiService,
    entity: ENTITY,
  });
};

/**
 * useDeleteProduct - DELETE product
 * 
 * @returns Mutation result
 */
export const useDeleteProduct = () => {
  return useApiDelete<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
  });
};

/**
 * useProductsByCategory - GET products by category
 * 
 * @param categoryId - Category ID
 * @param params - Pagination params (không bao gồm categoryId)
 * @returns Query result với data là PagedList<ProductEntity>
 */
export const useProductsByCategory = (
  categoryId: number,
  params?: Omit<PagedRequest, 'categoryId'>
) => {
  return useApiCustomQuery<PagedList<ProductEntity>>({
    apiService: productApiService,
    entity: ENTITY,
    queryKey: ['category', categoryId, params],
    queryFn: () => productApiService.getProductsByCategory(categoryId, params),
    options: {
      enabled: !!categoryId,
    },
  });
};

/**
 * useProductsBySupplier - GET products by supplier
 * 
 * @param supplierId - Supplier ID
 * @param params - Pagination params (không bao gồm supplierId)
 * @returns Query result với data là PagedList<ProductEntity>
 */
export const useProductsBySupplier = (
  supplierId: number,
  params?: Omit<PagedRequest, 'supplierId'>
) => {
  return useApiCustomQuery<PagedList<ProductEntity>>({
    apiService: productApiService,
    entity: ENTITY,
    queryKey: ['supplier', supplierId, params],
    queryFn: () => productApiService.getProductsBySupplier(supplierId, params),
    options: {
      enabled: !!supplierId,
    },
  });
};

/**
 * useProductsByBarcode - Search products by barcode
 * 
 * @param barcode - Barcode string
 * @returns Query result với data là ProductEntity[]
 */
export const useProductsByBarcode = (barcode: string) => {
  return useQuery<ProductEntity[]>({
    queryKey: [ENTITY, 'barcode', barcode],
    queryFn: () => productApiService.searchByBarcode(barcode),
    enabled: barcode.length > 0,
  });
};

