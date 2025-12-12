import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { SupplierHeader } from '../components/SupplierHeader'
import { SupplierSearchFilter } from '../components/SupplierSearchFilter'
import { SupplierStatistics } from '../components/SupplierStatistics'
import { supplierPageConfig } from '../config/supplierPageConfig'
import { useSupplierManagementPage } from '../hooks/useSupplierManagementPage'
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api'
import type { SupplierEntity } from '../types/entity'

export function SupplierManagementPage() {
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
                renderHeader={() => <SupplierHeader suppliers={suppliers} />}
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
            />
        </div>
    )
}
