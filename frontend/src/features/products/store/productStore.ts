import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
    productApi,
    ProductEntity,
    CreateProductRequest,
    UpdateProductRequest,
    PagedRequest,
    PagedList
} from '../api';

// Types cho Product Store
interface ProductState {
  // State
  selectedProduct: ProductEntity | null;

  // Actions
  setSelectedProduct: (product: ProductEntity | null) => void;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedProduct: null,

      // Actions
      setSelectedProduct: (product: ProductEntity | null) => {
        set({ selectedProduct: product });
      },

      clearSelectedProduct: () => {
        set({ selectedProduct: null });
      },
    }),
    {
      name: 'product-store'
    }
  )
);

// Selector hooks
export const useProductState = () => useProductStore((state) => ({
  selectedProduct: state.selectedProduct,
}));

export const useProductActions = () => useProductStore((state) => ({
  setSelectedProduct: state.setSelectedProduct,
  clearSelectedProduct: state.clearSelectedProduct,
}));
