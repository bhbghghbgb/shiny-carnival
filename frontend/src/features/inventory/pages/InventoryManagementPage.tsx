import { InventoryHeader } from '../components/InventoryHeader'
import { InventoryStatistics } from '../components/InventoryStatistics'
import { InventorySearchFilter } from '../components/InventorySearchFilter'
import { useInventoryManagementPage } from '../hooks/useInventoryManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { inventoryPageConfig } from '../config/inventoryPageConfig'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest } from '../types/api'

export function InventoryManagementPage() {
    const {
        inventories,
        total,

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

    // Tính số sản phẩm tồn kho thấp (giả sử < 10)
    const lowStockCount = inventories.filter(inv => inv.quantity < 10).length

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
                headerSlot={<InventoryHeader />}
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
