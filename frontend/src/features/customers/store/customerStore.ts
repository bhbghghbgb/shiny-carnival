import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { customerApi, CustomerEntity, CreateCustomerRequest, UpdateCustomerRequest, PagedRequest, PagedList } from '../api';

// Types cho Customer Store
interface CustomerState {
  // State
  selectedCustomer: CustomerEntity | null;

  // Actions
  setSelectedCustomer: (customer: CustomerEntity | null) => void;
  clearSelectedCustomer: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedCustomer: null,

      // Actions
      setSelectedCustomer: (customer: CustomerEntity | null) => {
        set({ selectedCustomer: customer });
      },

      clearSelectedCustomer: () => {
        set({ selectedCustomer: null });
      },
    }),
    {
      name: 'customer-store'
    }
  )
);

// Selector hooks
export const useCustomerState = () => useCustomerStore((state) => ({
  selectedCustomer: state.selectedCustomer,
}));

export const useCustomerActions = () => useCustomerStore((state) => ({
  setSelectedCustomer: state.setSelectedCustomer,
  clearSelectedCustomer: state.clearSelectedCustomer,
}));
