import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supplierApi, SupplierEntity, CreateSupplierRequest, UpdateSupplierRequest, PagedRequest, PagedList } from '../api';

// Types cho Supplier Store
interface SupplierState {
  // State
  selectedSupplier: SupplierEntity | null;

  // Actions
  setSelectedSupplier: (supplier: SupplierEntity | null) => void;
  clearSelectedSupplier: () => void;
}

export const useSupplierStore = create<SupplierState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedSupplier: null,

      // Actions
      setSelectedSupplier: (supplier: SupplierEntity | null) => {
        set({ selectedSupplier: supplier });
      },

      clearSelectedSupplier: () => {
        set({ selectedSupplier: null });
      },
    }),
    {
      name: 'supplier-store'
    }
  )
);

// Selector hooks
export const useSupplierState = () => useSupplierStore((state) => ({
  selectedSupplier: state.selectedSupplier,
}));

export const useSupplierActions = () => useSupplierStore((state) => ({
  setSelectedSupplier: state.setSelectedSupplier,
  clearSelectedSupplier: state.clearSelectedSupplier,
}));
