import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { orderApi, OrderEntity, OrderDetailsDto, CreateOrderRequest, UpdateOrderStatusRequest, OrderFilterParams, PagedList } from '../api';

// Types cho Order Store
interface OrderState {
  // State
  selectedOrder: OrderDetailsDto | null;

  // Actions
  setSelectedOrder: (order: OrderDetailsDto | null) => void;
  clearSelectedOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedOrder: null,

      // Actions
      setSelectedOrder: (order: OrderDetailsDto | null) => {
        set({ selectedOrder: order });
      },

      clearSelectedOrder: () => {
        set({ selectedOrder: null });
      },
    }),
    {
      name: 'order-store'
    }
  )
);

// Selector hooks
export const useOrderState = () => useOrderStore((state) => ({
  selectedOrder: state.selectedOrder,
}));

export const useOrderActions = () => useOrderStore((state) => ({
  setSelectedOrder: state.setSelectedOrder,
  clearSelectedOrder: state.clearSelectedOrder,
}));
