import { useState } from 'react'
import { Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { SupplierHeader } from '../components/SupplierHeader'
import { SupplierStatistics } from '../components/SupplierStatistics'
import { SupplierSearchFilter } from '../components/SupplierSearchFilter'
import { SupplierDetailModal } from '../components/SupplierDetailModal'
import { useSupplierManagementPage } from '../hooks/useSupplierManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { supplierPageConfig } from '../config/supplierPageConfig'
import type { SupplierEntity } from '../types/entity'
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api'

export function SupplierManagementPage() {
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const {
        suppliers,
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

        createSupplier,
        updateSupplier,
        deleteSupplier,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useSupplierManagementPage()

    const handleViewDetail = (supplier: SupplierEntity) => {
        setSelectedSupplierId(supplier.id)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedSupplierId(null)
    }

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<SupplierEntity, CreateSupplierRequest, UpdateSupplierRequest>
                config={supplierPageConfig}
                data={suppliers}
                total={total}
                loading={createSupplier.isPending || updateSupplier.isPending || deleteSupplier.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createSupplier.isPending}
                updateLoading={updateSupplier.isPending}
                deleteLoading={deleteSupplier.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={({ openCreate }) => <SupplierHeader onAddSupplier={openCreate} />}
                statisticsSlot={
                    <SupplierStatistics
                        totalSuppliers={total}
                        filteredCount={total}
                        activeSuppliers={total}
                        productCount={0}
                    />
                }
                filtersSlot={
                    <SupplierSearchFilter
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
            <SupplierDetailModal
                supplierId={selectedSupplierId}
                open={isDetailModalOpen}
                onClose={handleCloseDetailModal}
            />
        </div>
    )
}
