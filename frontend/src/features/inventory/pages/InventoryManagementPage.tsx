import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { InventoryHeader } from '../components/InventoryHeader'
import { InventorySearchFilter } from '../components/InventorySearchFilter'
import { InventoryStatistics } from '../components/InventoryStatistics'
import { inventoryPageConfig } from '../config/inventoryPageConfig'
import { useInventoryManagementPage } from '../hooks/useInventoryManagementPage'
import type { UpdateInventoryRequest } from '../types/api'
import type { InventoryEntity } from '../types/inventoryEntity'

export function InventoryManagementPage() {
    const {
        inventories,
        total,
        lowStockCount,

        searchText,
        productId,
        minQuantity,
        maxQuantity,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleProductFilter,
        handleQuantityRangeChange,
        handleSort,
        handlePageChange,
        clearFilters,

        handleUpdate,

        updateInventory,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useInventoryManagementPage()

    // lowStockCount lấy từ API /api/admin/inventory/low-stock trong hook

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<InventoryEntity, never, UpdateInventoryRequest>
                config={inventoryPageConfig}
                data={inventories}
                total={total}
                loading={updateInventory.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onUpdate={handleUpdate}
                createLoading={false}
                updateLoading={updateInventory.isPending}
                deleteLoading={false}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={() =><InventoryHeader inventories={inventories}/>}
                statisticsSlot={
                    <InventoryStatistics
                        totalItems={total}
                        lowStockCount={lowStockCount}
                    />
                }
                filtersSlot={
                    <InventorySearchFilter
                        searchText={searchText}
                        productId={productId}
                        minQuantity={minQuantity}
                        maxQuantity={maxQuantity}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSearchChange={handleSearch}
                        onProductChange={handleProductFilter}
                        onQuantityRangeChange={handleQuantityRangeChange}
                        onSortChange={handleSort}
                        onClearFilters={clearFilters}
                    />
                }
            />
        </div>
    )
}
