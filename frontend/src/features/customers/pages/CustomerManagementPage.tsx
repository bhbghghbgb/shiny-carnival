import { CustomerHeader } from '../components/CustomerHeader'
import { CustomerStatistics } from '../components/CustomerStatistics'
import { CustomerSearchFilter } from '../components/CustomerSearchFilter'
import { useCustomerManagementPage } from '../hooks/useCustomerManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { customerPageConfig } from '../config/customerPageConfig'
import type { CustomerEntity } from '../types/entity'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/api'

export function CustomerManagementPage() {
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
                renderHeader={({ openCreate }) => <CustomerHeader onAddCustomer={openCreate} />}
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
            />
        </div>
    )
}

