import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
} from '../../../hooks/useApi';
import { categoryApiService } from '../api/CategoryApiService';
import type { CategoryEntity } from '../types/entity';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'categories';

/**
 * useCategories - GET all categories (không phân trang)
 */
export const useCategories = (params?: Record<string, unknown>) => {
  return useApiList<CategoryEntity>({
    apiService: categoryApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useCategoriesPaginated - GET categories với phân trang
 */
export const useCategoriesPaginated = (params?: PagedRequest) => {
  return useApiPaginated<CategoryEntity>({
    apiService: categoryApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useCategory - GET category by ID
 */
export const useCategory = (id: string | number) => {
  return useApiDetail<CategoryEntity>({
    apiService: categoryApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateCategory - POST create category
 */
export const useCreateCategory = (options?: Parameters<typeof useApiCreate<CategoryEntity, CreateCategoryRequest>>[0]['options']) => {
  return useApiCreate<CategoryEntity, CreateCategoryRequest>({
    apiService: categoryApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdateCategory - PUT update category
 */
export const useUpdateCategory = (options?: Parameters<typeof useApiUpdate<CategoryEntity, UpdateCategoryRequest>>[0]['options']) => {
  return useApiUpdate<CategoryEntity, UpdateCategoryRequest>({
    apiService: categoryApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useDeleteCategory - DELETE category
 */
export const useDeleteCategory = (options?: Parameters<typeof useApiDelete<CategoryEntity>>[0]['options']) => {
  return useApiDelete<CategoryEntity>({
    apiService: categoryApiService,
    entity: ENTITY,
    options,
  });
};

