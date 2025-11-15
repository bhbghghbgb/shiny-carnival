import { useState, useEffect, useMemo, useCallback } from 'react'
import { message } from 'antd'
import { useOrderStore } from '../store/orderStore'
import type { OrderStatus } from '../../../config/api'

export const useOrderManagement = () => {
    const orders = useOrderStore((state) => state.orders)
    const loading = useOrderStore((state) => state.loading)
    const error = useOrderStore((state) => state.error)
    const searchText = useOrderStore((state) => state.searchText)
    const statusFilter = useOrderStore((state) => state.statusFilter)
    const sortField = useOrderStore((state) => state.sortField)
    const sortOrder = useOrderStore((state) => state.sortOrder)

    const fetchOrders = useOrderStore((state) => state.fetchOrders)
    const deleteOrderFromStore = useOrderStore((state) => state.deleteOrder)
    const setSearchText = useOrderStore((state) => state.setSearchText)
    const setStatusFilter = useOrderStore((state) => state.setStatusFilter)
    const setSort = useOrderStore((state) => state.setSort)
    const clearFilters = useOrderStore((state) => state.clearFilters)

    // Local UI state for modals
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [deletingOrder, setDeletingOrder] = useState<any>(null)

    const fetchOrdersOnce = useCallback(() => {
        fetchOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Fetch orders on mount only
    useEffect(() => {
        fetchOrdersOnce()
    }, [fetchOrdersOnce])

    // Show error message if any
    useEffect(() => {
        if (error) {
            message.error(error)
        }
    }, [error])

    const filteredOrders = useMemo(() => {
        let filtered = [...orders]

        if (searchText) {
            const searchLower = searchText.toLowerCase()
            filtered = filtered.filter(
                (order) =>
                    order.id.toString().includes(searchLower) ||
                    order.customerId.toString().includes(searchLower)
            )
        }

        if (statusFilter !== undefined) {
            filtered = filtered.filter((order) => order.status === statusFilter)
        }

        filtered.sort((a, b) => {
            let aValue: any = (a as any)[sortField]
            let bValue: any = (b as any)[sortField]

            if (sortField === 'orderDate') {
                aValue = new Date(aValue).getTime()
                bValue = new Date(bValue).getTime()
            }

            if (sortOrder === 'ascend') {
                return aValue > bValue ? 1 : -1
            }

            return aValue < bValue ? 1 : -1
        })

        return filtered
    }, [orders, searchText, statusFilter, sortField, sortOrder])

    const statistics = useMemo(() => {
        return {
            total: filteredOrders.length,
            pendingCount: filteredOrders.filter((o) => o.status === 'pending')
                .length,
            paidCount: filteredOrders.filter((o) => o.status === 'paid').length,
            canceledCount: filteredOrders.filter((o) => o.status === 'canceled')
                .length,
        }
    }, [filteredOrders])

    // Modal handlers
    const showDeleteModal = useCallback((order: any) => {
        setDeletingOrder(order)
        setIsDeleteModalVisible(true)
    }, [])

    const handleDelete = useCallback(async () => {
        if (deletingOrder) {
            try {
                await deleteOrderFromStore(deletingOrder.id)
                message.success('Xóa đơn hàng thành công!')
                setIsDeleteModalVisible(false)
                setDeletingOrder(null)
            } catch (error: any) {
                message.error(error.message || 'Không thể xóa đơn hàng')
            }
        }
    }, [deletingOrder, deleteOrderFromStore])

    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalVisible(false)
        setDeletingOrder(null)
    }, [])

    const handleSearch = useCallback(
        (value: string) => {
            setSearchText(value)
        },
        [setSearchText]
    )

    const handleStatus = useCallback(
        (value: OrderStatus | undefined) => {
            setStatusFilter(value)
        },
        [setStatusFilter]
    )

    const handleSorting = useCallback(
        (field: string, order: 'ascend' | 'descend') => {
            setSort(field, order)
        },
        [setSort]
    )

    const handleClearFilters = useCallback(() => {
        clearFilters()
    }, [clearFilters])

    const refreshOrders = useCallback(() => {
        fetchOrders()
    }, [fetchOrders])

    return {
        // Data
        orders: filteredOrders,
        totalOrders: statistics.total,
        pendingCount: statistics.pendingCount,
        paidCount: statistics.paidCount,
        canceledCount: statistics.canceledCount,
        loading,

        // Modal states
        isDeleteModalVisible,
        deletingOrder,

        // Search/Filter states
        searchText,
        statusFilter,
        sortField,
        sortOrder,

        // Handlers
        showDeleteModal,
        handleDelete,
        handleDeleteCancel,
        handleSearch,
        handleStatusFilter: handleStatus,
        handleSort: handleSorting,
        clearFilters: handleClearFilters,
        refreshOrders,
    }
}
