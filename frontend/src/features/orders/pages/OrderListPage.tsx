import { Space } from 'antd'
import { useRouter } from '@tanstack/react-router'
import { OrderHeader } from '../components/OrderHeader'
import { OrderStatistics } from '../components/OrderStatistics'
import { OrderSearchFilter } from '../components/OrderSearchFilter'
import { OrderTable } from '../components/OrderTable'
import { OrderModals } from '../components/OrderModals'
import type { OrderEntity } from '../types/entity'
import { useOrderManagement } from '../hooks/useOrderManagement'

export const OrderListPage = () => {
    const router = useRouter()
    const {
        // Data
        orders,
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
    } = useOrderManagement()

    const handleAddOrder = () => {
        console.log('Navigating to: /admin/orders/create')
        router.navigate({ to: '/admin/orders/create' })
    }

    const handleViewOrder = (order: OrderEntity) => {
        const path = `/admin/orders/${order.id}`
        console.log('Navigating to:', path)
        router.navigate({ to: path })
    }

    const handleEditOrder = (order: OrderEntity) => {
        const path = `/admin/orders/${order.id}/edit`
        console.log('Navigating to:', path)
        router.navigate({ to: path })
    }

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <OrderHeader onAddOrder={handleAddOrder} />

                {/* Statistics */}
                <OrderStatistics
                    totalOrders={totalOrders}
                    pendingCount={pendingCount}
                    paidCount={paidCount}
                    canceledCount={canceledCount}
                />

                {/* Search and Filter Controls */}
                <OrderSearchFilter
                    searchText={searchText}
                    statusFilter={statusFilter}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSearchChange={handleSearch}
                    onStatusFilterChange={handleStatusFilter}
                    onSortChange={handleSort}
                    onClearFilters={clearFilters}
                />

                {/* Table */}
                <OrderTable
                    orders={orders}
                    onViewOrder={handleViewOrder}
                    onEditOrder={handleEditOrder}
                    onDeleteOrder={showDeleteModal}
                    loading={loading}
                />
            </Space>

            {/* Modals */}
            <OrderModals
                isDeleteModalVisible={isDeleteModalVisible}
                deletingOrder={deletingOrder}
                onDeleteOk={handleDelete}
                onDeleteCancel={handleDeleteCancel}
            />
        </div>
    )
}
