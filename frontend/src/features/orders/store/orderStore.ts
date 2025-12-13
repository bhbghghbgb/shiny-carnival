import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { OrderEntity, OrderDetailsDto } from '../types/entity'
import type { OrderStatus } from '../../../config/api'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'
import { orderService } from '../api/orderService'
// Sau này: import { orderApi } from '../api/orderApi'

export interface DraftOrderItem {
    productId: number
    productName: string
    barcode?: string
    price: number
    quantity: number
    subtotal: number
    lastScanned?: string
}

interface OrderState {
    // Data State
    orders: OrderEntity[]
    loading: boolean
    error: string | null

    // Draft order (cart) State
    draftOrderItems: DraftOrderItem[]

    // UI State
    selectedOrder: OrderDetailsDto | null
    searchText: string
    statusFilter: OrderStatus | undefined
    sortField: string
    sortOrder: 'ascend' | 'descend'

    // Actions - CRUD Operations
    fetchOrders: () => Promise<void>
    createOrder: (orderData: CreateOrderRequest) => Promise<void>
    updateOrderStatus: (id: number, statusData: UpdateOrderStatusRequest) => Promise<void>
    deleteOrder: (id: number) => Promise<void>

    // Actions - UI State
    setSelectedOrder: (order: OrderDetailsDto | null) => void
    setSearchText: (text: string) => void
    setStatusFilter: (status: OrderStatus | undefined) => void
    setSort: (field: string, order: 'ascend' | 'descend') => void
    clearSelectedOrder: () => void
    clearFilters: () => void

    // Draft order (cart) Actions
    addDraftItem: (product: {
        id: number
        productName: string
        barcode?: string
        price: number
    }) => void
    updateDraftQuantity: (productId: number, quantity: number) => void
    removeDraftItem: (productId: number) => void
    clearDraftItems: () => void

    // Draft selectors
    getDraftTotal: () => number
    getDraftCount: () => number

    // Computed/Selectors
    getFilteredOrders: () => OrderEntity[]
    getStatistics: () => {
        total: number
        pendingCount: number
        paidCount: number
        canceledCount: number
    }
}

export const useOrderStore = create<OrderState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial State
                orders: [],
                loading: false,
                error: null,
                draftOrderItems: [],
                selectedOrder: null,
                searchText: '',
                statusFilter: undefined,
                sortField: 'orderDate',
                sortOrder: 'descend',

                // CRUD Actions
                fetchOrders: async () => {
                    set({ loading: true, error: null })
                    try {
                        // Mock data
                        const data = (await orderService.getOrders()) as OrderEntity[]
                        set({ orders: data, loading: false })

                        // Sau này: Real API
                        // const response = await orderApi.getOrders()
                        // if (!response.isError && response.data) {
                        //     set({ orders: response.data.items, loading: false })
                        // } else {
                        //     set({ error: response.message, loading: false })
                        // }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Không thể tải danh sách đơn hàng',
                            loading: false,
                        })
                    }
                },

                createOrder: async (orderData) => {
                    set({ loading: true, error: null })
                    try {
                        // Mock data
                        const newOrder = (await orderService.createOrder(
                            orderData
                        )) as OrderEntity
                        set({ orders: [...get().orders, newOrder], loading: false })

                        // Sau này: Real API
                        // const response = await orderApi.createOrder(orderData)
                        // if (!response.isError && response.data) {
                        //     set({ orders: [...get().orders, response.data], loading: false })
                        // } else {
                        //     set({ error: response.message, loading: false })
                        // }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Không thể tạo đơn hàng',
                            loading: false,
                        })
                    }
                },

                updateOrderStatus: async (id, statusData) => {
                    set({ loading: true, error: null })
                    try {
                        // Mock data
                        const updated = (await orderService.updateOrderStatus(
                            id,
                            statusData
                        )) as OrderEntity
                        if (updated) {
                            const updatedOrders = get().orders.map((order) =>
                                order.id === id ? updated : order
                            )
                            set({ orders: updatedOrders, loading: false })
                        }

                        // Sau này: Real API
                        // const response = await orderApi.updateOrderStatus(id, statusData)
                        // if (!response.isError && response.data) {
                        //     const updatedOrders = get().orders.map((order) =>
                        //         order.id === id ? response.data : order
                        //     )
                        //     set({ orders: updatedOrders, loading: false })
                        // } else {
                        //     set({ error: response.message, loading: false })
                        // }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Không thể cập nhật đơn hàng',
                            loading: false,
                        })
                    }
                },

                deleteOrder: async (id) => {
                    set({ loading: true, error: null })
                    try {
                        // Mock data
                        await orderService.deleteOrder(id)
                        const filteredOrders = get().orders.filter(
                            (order) => order.id !== id
                        )
                        set({ orders: filteredOrders, loading: false })

                        // Sau này: Real API
                        // const response = await orderApi.deleteOrder(id)
                        // if (!response.isError && response.data) {
                        //     const filteredOrders = get().orders.filter((order) => order.id !== id)
                        //     set({ orders: filteredOrders, loading: false })
                        // } else {
                        //     set({ error: response.message, loading: false })
                        // }
                    } catch (error: any) {
                        set({
                            error: error.message || 'Không thể xóa đơn hàng',
                            loading: false,
                        })
                    }
                },

                // UI Actions
                setSelectedOrder: (order) => set({ selectedOrder: order }),
                setSearchText: (text) => set({ searchText: text }),
                setStatusFilter: (status) => set({ statusFilter: status }),
                setSort: (field, order) => set({ sortField: field, sortOrder: order }),
                clearSelectedOrder: () => set({ selectedOrder: null }),
                clearFilters: () =>
                    set({
                        searchText: '',
                        statusFilter: undefined,
                        sortField: 'orderDate',
                        sortOrder: 'descend',
                    }),

                // Draft order actions
                addDraftItem: (product) => {
                    set((state) => {
                        // Ưu tiên ghép theo barcode (vì scan dùng barcode), fallback theo id
                        const existingIndex = state.draftOrderItems.findIndex((i) => {
                            if (product.barcode) return i.barcode === product.barcode;
                            return i.productId === product.id;
                        })

                        // Nếu đã tồn tại, tăng số lượng thay vì tạo item mới
                        if (existingIndex >= 0) {
                            const existing = state.draftOrderItems[existingIndex]
                            const updatedItem: DraftOrderItem = {
                                ...existing,
                                // Không đổi productId để giữ key ổn định khi dùng mock
                                quantity: existing.quantity + 1,
                                subtotal: (existing.quantity + 1) * existing.price,
                                lastScanned: new Date().toISOString(),
                            }
                            const updated = [...state.draftOrderItems]
                            updated[existingIndex] = updatedItem
                            return { draftOrderItems: updated }
                        }

                        // Nếu chưa có, thêm mới
                        const newItem: DraftOrderItem = {
                            productId: product.id,
                            productName: product.productName,
                            barcode: product.barcode,
                            price: product.price,
                            quantity: 1,
                            subtotal: product.price,
                            lastScanned: new Date().toISOString(),
                        }

                        return {
                            draftOrderItems: [newItem, ...state.draftOrderItems],
                        }
                    })
                },

                updateDraftQuantity: (productId, quantity) => {
                    if (quantity < 1) return
                    set((state) => ({
                        draftOrderItems: state.draftOrderItems.map((item) =>
                            item.productId === productId
                                ? {
                                    ...item,
                                    quantity,
                                    subtotal: quantity * item.price,
                                }
                                : item
                        ),
                    }))
                },

                removeDraftItem: (productId) =>
                    set((state) => ({
                        draftOrderItems: state.draftOrderItems.filter(
                            (i) => i.productId !== productId
                        ),
                    })),

                clearDraftItems: () => set({ draftOrderItems: [] }),

                // Draft selectors
                getDraftTotal: () =>
                    get().draftOrderItems.reduce(
                        (sum, item) => sum + item.subtotal,
                        0
                    ),

                getDraftCount: () =>
                    get().draftOrderItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    ),

                // Computed
                getFilteredOrders: () => {
                    const { orders, searchText, statusFilter, sortField, sortOrder } =
                        get()
                    let filtered = [...orders]

                    // Search filter - tìm theo ID hoặc customerId
                    if (searchText) {
                        const searchLower = searchText.toLowerCase()
                        filtered = filtered.filter(
                            (order) =>
                                order.id.toString().includes(searchLower) ||
                                order.customerId.toString().includes(searchLower)
                        )
                    }

                    // Status filter
                    if (statusFilter !== undefined) {
                        filtered = filtered.filter(
                            (order) => order.status === statusFilter
                        )
                    }

                    // Sort
                    filtered.sort((a, b) => {
                        let aValue: any = a[sortField as keyof OrderEntity]
                        let bValue: any = b[sortField as keyof OrderEntity]

                        if (sortField === 'orderDate') {
                            aValue = new Date(aValue).getTime()
                            bValue = new Date(bValue).getTime()
                        }

                        if (sortOrder === 'ascend') {
                            return aValue > bValue ? 1 : -1
                        } else {
                            return aValue < bValue ? 1 : -1
                        }
                    })

                    return filtered
                },

                getStatistics: () => {
                    const filtered = get().getFilteredOrders()
                    return {
                        total: filtered.length,
                        pendingCount: filtered.filter((o) => o.status === 'pending')
                            .length,
                        paidCount: filtered.filter((o) => o.status === 'paid').length,
                        canceledCount: filtered.filter((o) => o.status === 'canceled')
                            .length,
                    }
                },
            }),
            {
                name: 'order-store',
                partialize: (state) => ({ draftOrderItems: state.draftOrderItems }),
            }
        )
    )
)

// Selector Hooks
export const useOrders = () => useOrderStore((state) => state.orders)
export const useOrderLoading = () => useOrderStore((state) => state.loading)
export const useOrderError = () => useOrderStore((state) => state.error)
export const useSelectedOrder = () =>
    useOrderStore((state) => state.selectedOrder)

// Draft order selectors
export const useDraftOrderItems = () =>
    useOrderStore((state) => state.draftOrderItems)

export const useOrderActions = () =>
    useOrderStore((state) => ({
        fetchOrders: state.fetchOrders,
        createOrder: state.createOrder,
        updateOrderStatus: state.updateOrderStatus,
        deleteOrder: state.deleteOrder,
        setSelectedOrder: state.setSelectedOrder,
        clearSelectedOrder: state.clearSelectedOrder,
        setSearchText: state.setSearchText,
        setStatusFilter: state.setStatusFilter,
        setSort: state.setSort,
        clearFilters: state.clearFilters,
        addDraftItem: state.addDraftItem,
        updateDraftQuantity: state.updateDraftQuantity,
        removeDraftItem: state.removeDraftItem,
        clearDraftItems: state.clearDraftItems,
    }))

export const useFilteredOrders = () => {
    // Subscribe to all dependencies to ensure re-render on changes
    return useOrderStore((state) => {
        let filtered = [...state.orders]

        // Search filter
        if (state.searchText) {
            const searchLower = state.searchText.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.id.toString().includes(searchLower) ||
                    order.customerId.toString().includes(searchLower)
            )
        }

        // Status filter
        if (state.statusFilter !== undefined) {
            filtered = filtered.filter(
                (order) => order.status === state.statusFilter
            )
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue: any = a[state.sortField as keyof OrderEntity]
            let bValue: any = b[state.sortField as keyof OrderEntity]

            if (state.sortField === 'orderDate') {
                aValue = new Date(aValue).getTime()
                bValue = new Date(bValue).getTime()
            }

            if (state.sortOrder === 'ascend') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    })
}

export const useOrderStatistics = () => {
    return useOrderStore((state) => {
        const filtered = state.getFilteredOrders()
        return {
            total: filtered.length,
            pendingCount: filtered.filter((o) => o.status === 'pending').length,
            paidCount: filtered.filter((o) => o.status === 'paid').length,
            canceledCount: filtered.filter((o) => o.status === 'canceled').length,
        }
    })
}

// Search/Filter selectors
export const useOrderSearchText = () =>
    useOrderStore((state) => state.searchText)
export const useOrderStatusFilter = () =>
    useOrderStore((state) => state.statusFilter)
export const useOrderSort = () =>
    useOrderStore((state) => ({
        sortField: state.sortField,
        sortOrder: state.sortOrder,
    }))
