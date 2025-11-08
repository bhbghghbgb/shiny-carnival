import { useState, useEffect } from 'react'
import { message } from 'antd'
import type { OrderEntity } from '../types/entity'
import type { OrderStatus } from '../../../config/api'
// import { getRouteApi } from '@tanstack/react-router'
// import { orderApi } from '../api/orderApi'
import { orders as mockOrders } from '../../../_mocks/orders'
import { onOrdersChanged } from '../utils/orderEvents'

// const routeApi = getRouteApi('/admin/orders')

export const useOrderManagement = () => {
    // Use mock data (for development)
    const initialOrders = mockOrders as unknown as OrderEntity[]

    // TODO: Uncomment below to use API data from route loader
    // const { orders: initialOrders } = routeApi.useLoaderData()

    const [orders, setOrders] = useState(initialOrders)
    const [filteredOrders, setFilteredOrders] = useState<OrderEntity[]>([])
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [deletingOrder, setDeletingOrder] = useState<OrderEntity | null>(null)
    const [loading, setLoading] = useState(false)

    // Search, Filter, Sort states
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(
        undefined
    )
    const [sortField, setSortField] = useState<string>('orderDate')
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend')

    // Keep orders in sync with mock changes when using nested routes
    useEffect(() => {
        const unsubscribe = onOrdersChanged(() => {
            // Re-seed from mutable mock
            setOrders([...mockOrders] as unknown as OrderEntity[])
        })
        return unsubscribe
    }, [])

    // Filter and sort orders when search, filter, or sort changes
    useEffect(() => {
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
            filtered = filtered.filter((order) => order.status === statusFilter)
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

        setFilteredOrders(filtered)
    }, [orders, searchText, statusFilter, sortField, sortOrder])

    // Refresh orders from API
    const refreshOrders = async () => {
        // Mock version - no API call needed
        console.log('Refresh orders - using mock data')
        setOrders([...mockOrders] as unknown as OrderEntity[])

        // TODO: Uncomment below to use real API
        // try {
        //     setLoading(true)
        //     const response = await orderApi.getOrders()
        //     if (!response.isError && response.data) {
        //         setOrders(response.data.items)
        //     }
        // } catch (error) {
        //     console.error('Refresh orders error:', error)
        // } finally {
        //     setLoading(false)
        // }
    }

    // Modal handlers
    const showDeleteModal = (order: OrderEntity) => {
        setDeletingOrder(order)
        setIsDeleteModalVisible(true)
    }

    const handleDelete = async () => {
        if (deletingOrder) {
            try {
                setLoading(true)
                // TODO: Implement delete API when backend is ready
                // const response = await orderApi.deleteOrder(deletingOrder.id)
                // if (!response.isError && response.data) {
                message.success('Xóa đơn hàng thành công!')
                setOrders(
                    orders.filter((o: OrderEntity) => o.id !== deletingOrder.id)
                )
                setIsDeleteModalVisible(false)
                setDeletingOrder(null)
                // await refreshOrders()
                // }
            } catch (error: any) {
                message.error(error.message || 'Không thể xóa đơn hàng')
                console.error('Delete error:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false)
        setDeletingOrder(null)
    }

    // Search/Filter handlers
    const handleSearch = (value: string) => {
        setSearchText(value)
    }

    const handleStatusFilter = (value: OrderStatus | undefined) => {
        setStatusFilter(value)
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        setSortField(field)
        setSortOrder(order)
    }

    const clearFilters = () => {
        setSearchText('')
        setStatusFilter(undefined)
        setSortField('orderDate')
        setSortOrder('descend')
    }

    // Statistics
    const totalOrders = filteredOrders.length
    const pendingCount = filteredOrders.filter(
        (o) => o.status === 'pending'
    ).length
    const paidCount = filteredOrders.filter((o) => o.status === 'paid').length
    const canceledCount = filteredOrders.filter(
        (o) => o.status === 'canceled'
    ).length

    return {
        // Data
        orders: filteredOrders,
        totalOrders,
        pendingCount,
        paidCount,
        canceledCount,
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
        handleStatusFilter,
        handleSort,
        clearFilters,
        refreshOrders,
    }
}
