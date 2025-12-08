/**
 * Products Hooks
 * 
 * Export tất cả hooks cho Products feature
 */

export {
  useProducts,
  useProductsPaginated,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  usePatchProduct,
  useDeleteProduct,
  useProductsByCategory,
  useProductsBySupplier,
  useProductsByBarcode,
} from './useProducts';

export { useProductsWithRouter } from './useProductsWithRouter';
export { useProductsLocal } from './useProductsLocal';
export type { ProductFilters } from './useProductsLocal';

