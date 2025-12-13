import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { OrderDetailsDto } from '../types/entity';

// Types cho Draft Order Item
export interface DraftOrderItem {
    productId: number;
    productName: string;
    categoryName: string;
    barcode: string;
    price: number;
    quantity: number;
    subtotal: number;
}

// Types cho Draft Order
export interface DraftOrder {
    customerId: number | null;
    orderItems: DraftOrderItem[];
    promoCode: string | null;
}

// Types cho Order Store
interface OrderState {
    // State cho selected order (không persist)
    selectedOrder: OrderDetailsDto | null;

    // State cho draft order (có persist vào localStorage)
    draftOrder: DraftOrder;

    // Actions cho selected order
    setSelectedOrder: (order: OrderDetailsDto | null) => void;
    clearSelectedOrder: () => void;

    // Actions cho draft order
    setDraftCustomer: (customerId: number | null) => void;
    addDraftOrderItem: (item: DraftOrderItem) => void;
    removeDraftOrderItem: (productId: number) => void;
    updateDraftOrderItemQuantity: (productId: number, quantity: number) => void;
    setDraftPromoCode: (promoCode: string | null) => void;
    clearDraftOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                selectedOrder: null,
                draftOrder: {
                    customerId: null,
                    orderItems: [],
                    promoCode: null,
                },

                // Actions cho selected order
                setSelectedOrder: (order: OrderDetailsDto | null) => {
                    set({ selectedOrder: order });
                },

                clearSelectedOrder: () => {
                    set({ selectedOrder: null });
                },

                // Actions cho draft order
                setDraftCustomer: (customerId: number | null) => {
                    set((state) => ({
                        draftOrder: {
                            ...state.draftOrder,
                            customerId,
                        },
                    }));
                },

                addDraftOrderItem: (item: DraftOrderItem) => {
                    set((state) => {
                        // Kiểm tra sản phẩm đã tồn tại chưa
                        const existingIndex = state.draftOrder.orderItems.findIndex(
                            (i) => i.productId === item.productId
                        );
                        if (existingIndex >= 0) {
                            // Nếu đã tồn tại, tăng số lượng
                            const existing = state.draftOrder.orderItems[existingIndex];
                            const newQuantity = existing.quantity + item.quantity;
                            return {
                                draftOrder: {
                                    ...state.draftOrder,
                                    orderItems: state.draftOrder.orderItems.map((i, idx) =>
                                        idx === existingIndex
                                            ? {
                                                ...i,
                                                quantity: newQuantity,
                                                subtotal: i.price * newQuantity,
                                            }
                                            : i
                                    ),
                                },
                            };
                        }
                        return {
                            draftOrder: {
                                ...state.draftOrder,
                                orderItems: [...state.draftOrder.orderItems, item],
                            },
                        };
                    });
                },

                removeDraftOrderItem: (productId: number) => {
                    set((state) => ({
                        draftOrder: {
                            ...state.draftOrder,
                            orderItems: state.draftOrder.orderItems.filter(
                                (item) => item.productId !== productId
                            ),
                        },
                    }));
                },

                updateDraftOrderItemQuantity: (productId: number, quantity: number) => {
                    set((state) => ({
                        draftOrder: {
                            ...state.draftOrder,
                            orderItems: state.draftOrder.orderItems.map((item) =>
                                item.productId === productId
                                    ? {
                                        ...item,
                                        quantity,
                                        subtotal: item.price * quantity,
                                    }
                                    : item
                            ),
                        },
                    }));
                },

                setDraftPromoCode: (promoCode: string | null) => {
                    set((state) => ({
                        draftOrder: {
                            ...state.draftOrder,
                            promoCode,
                        },
                    }));
                },

                clearDraftOrder: () => {
                    set({
                        draftOrder: {
                            customerId: null,
                            orderItems: [],
                            promoCode: null,
                        },
                    });
                },
            }),
            {
                name: 'order-draft-storage', // localStorage key
                partialize: (state) => ({
                    // Chỉ persist draftOrder, không persist selectedOrder
                    draftOrder: state.draftOrder,
                }),
            }
        ),
        {
            name: 'order-store',
        }
    )
);

// Selector hooks để tối ưu re-renders
// Hook này subscribe vào state và tự động re-render component khi state thay đổi
// Sử dụng cho các component cần hiển thị order info và tự động cập nhật
export const useOrder = () => useOrderStore((state) => ({
    selectedOrder: state.selectedOrder,
    draftOrder: state.draftOrder,
}));

export const useDraftOrderItems = () => useOrderStore((state) => state.draftOrder.orderItems);
export const useDraftOrderTotal = () => useOrderStore((state) =>
    state.draftOrder.orderItems.reduce((sum, item) => sum + item.subtotal, 0)
);
export const useDraftOrderCount = () => useOrderStore((state) =>
    state.draftOrder.orderItems.reduce((count, item) => count + item.quantity, 0)
);

// Lưu ý: Actions nên dùng getState() để tránh re-render không cần thiết
// 
// Actions (không cần subscribe):
//   useOrderStore.getState().setSelectedOrder(order)
//   useOrderStore.getState().clearSelectedOrder()
//   useOrderStore.getState().setDraftCustomer(customerId)
//   useOrderStore.getState().addDraftOrderItem(item)
//   useOrderStore.getState().removeDraftOrderItem(productId)
//   useOrderStore.getState().updateDraftOrderItemQuantity(productId, quantity)
//   useOrderStore.getState().setDraftPromoCode(promoCode)
//   useOrderStore.getState().clearDraftOrder()
//
// Nếu cần subscribe vào state (tự động re-render khi state thay đổi):
//   const { selectedOrder, draftOrder } = useOrder();
//   const draftOrder = useOrderStore((state) => state.draftOrder);
//   const selectedOrder = useOrderStore((state) => state.selectedOrder);
