import { EyeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { CustomerDetailModal } from '../components/CustomerDetailModal'
import { CustomerHeader } from '../components/CustomerHeader'
import { CustomerSearchFilter } from '../components/CustomerSearchFilter'
import { CustomerStatistics } from '../components/CustomerStatistics'
import { customerPageConfig } from '../config/customerPageConfig'
import { useCustomerManagementPage } from '../hooks/useCustomerManagementPage'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/api'
import type { CustomerEntity } from '../types/entity'

export function CustomerManagementPage() {
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const {
        customers,
        total,

        searchText,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createCustomer,
        updateCustomer,
        deleteCustomer,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useCustomerManagementPage()

    const handleViewDetail = (customer: CustomerEntity) => {
        setSelectedCustomerId(customer.id)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedCustomerId(null)
    }

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<CustomerEntity, CreateCustomerRequest, UpdateCustomerRequest>
                config={customerPageConfig}
                data={customers}
                total={total}
                loading={createCustomer.isPending || updateCustomer.isPending || deleteCustomer.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createCustomer.isPending}
                updateLoading={updateCustomer.isPending}
                deleteLoading={deleteCustomer.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={() => <CustomerHeader customers={customers} />}
                statisticsSlot={
                    <CustomerStatistics
                        totalCustomers={total}
                    />
                }
                filtersSlot={
                    <CustomerSearchFilter
                        searchText={searchText}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSearchChange={handleSearch}
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
            />
            <CustomerDetailModal
                customerId={selectedCustomerId}
                open={isDetailModalOpen}
                onClose={handleCloseDetailModal}
            />
        </div>
    )
}

