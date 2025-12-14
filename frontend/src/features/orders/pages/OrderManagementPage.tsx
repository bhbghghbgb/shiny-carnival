import { useState } from 'react'
import { Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { OrderHeader } from '../components/OrderHeader'
import { OrderStatistics } from '../components/OrderStatistics'
import { OrderSearchFilter } from '../components/OrderSearchFilter'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { CreateOrderForm } from '../components/CreateOrderForm'
import { useOrderManagementPage } from '../hooks/useOrderManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { orderPageConfig } from '../config/orderPageConfig'
import type { OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'

export function OrderManagementPage() {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const {
        orders,
        total,
        totalRevenue,

        searchText,
        statusFilter,
        customerId,
        userId,
        startDate,
        endDate,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleStatusFilter,
        handleCustomerFilter,
        handleUserFilter,
        handleDateRangeChange,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createOrder,
        updateOrderStatus,
        deleteOrder,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useOrderManagementPage()

    const handleViewDetail = (order: OrderEntity) => {
        setSelectedOrderId(order.id)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedOrderId(null)
    }

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<OrderEntity, CreateOrderRequest, UpdateOrderStatusRequest>
                config={orderPageConfig}
                data={orders}
                total={total}
                loading={createOrder.isPending || updateOrderStatus.isPending || deleteOrder.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createOrder.isPending}
                updateLoading={updateOrderStatus.isPending}
                deleteLoading={deleteOrder.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={({ openCreate }) => <OrderHeader onAddOrder={openCreate} />}
                statisticsSlot={
                    <OrderStatistics
                        totalOrders={total}
                        totalRevenue={totalRevenue}
                    />
                }
                filtersSlot={
                    <OrderSearchFilter
                        searchText={searchText}
                        status={statusFilter}
                        customerId={customerId}
                        userId={userId}
                        startDate={startDate}
                        endDate={endDate}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSearchChange={handleSearch}
                        onStatusFilterChange={handleStatusFilter}
                        onCustomerChange={handleCustomerFilter}
                        onUserChange={handleUserFilter}
                        onDateRangeChange={handleDateRangeChange}
                        onSortChange={handleSort}
                        onClearFilters={clearFilters}
                    />
                }
                renderCustomActions={(record) => (
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        Chi tiết
                    </Button>
                )}
                renderCustomForm={({ mode, onSubmit, onCancel, loading, errorMessage, onClearError }) => {
                    // Chỉ render custom form cho create mode
                    if (mode === 'create') {
                        return (
                            <CreateOrderForm
                                onSubmit={onSubmit as (values: CreateOrderRequest) => Promise<void>}
                                onCancel={onCancel}
                                loading={loading}
                                errorMessage={errorMessage}
                                onClearError={onClearError}
                            />
                        )
                    }
                    // Update mode vẫn dùng generic form
                    return null
                }}
            />
            <OrderDetailModal
                orderId={selectedOrderId}
                open={isDetailModalOpen}
                onClose={handleCloseDetailModal}
            />
        </div>
    )
}

