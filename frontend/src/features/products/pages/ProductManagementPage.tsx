import { ProductHeader } from '../components/ProductHeader'
import { ProductStatistics } from '../components/ProductStatistics'
import { ProductSearchFilter } from '../components/ProductSearchFilter'
import { useProductManagementPage } from '../hooks/useProductManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { productPageConfig } from '../config/productPageConfig'
import type { ProductEntity } from '../types/entity'
import type { CreateProductRequest, UpdateProductRequest } from '../types/api'

export function ProductManagementPage() {
    const {
        products,
        total,
        placeholderStats,

        searchText,
        sortField,
        sortOrder,
        page,
        pageSize,
        categoryId,
        supplierId,
        minPrice,
        maxPrice,

        handleSearch,
        handleCategoryFilter,
        handleSupplierFilter,
        handlePriceRangeChange,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createProduct,
        updateProduct,
        deleteProduct,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useProductManagementPage()

    return (
        <div style={{ padding: '24px' }}>
            <GenericPage<ProductEntity, CreateProductRequest, UpdateProductRequest>
                config={productPageConfig}
                data={products}
                total={total}
                loading={createProduct.isPending || updateProduct.isPending || deleteProduct.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createProduct.isPending}
                updateLoading={updateProduct.isPending}
                deleteLoading={deleteProduct.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={({ openCreate }) => <ProductHeader onAddProduct={openCreate} />}
                statisticsSlot={
                    <ProductStatistics
                        totalProducts={total}
                        lowStock={placeholderStats.lowStock}
                    />
                }
                filtersSlot={
                    <ProductSearchFilter
                        searchText={searchText}
                        categoryId={categoryId}
                        supplierId={supplierId}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSearchChange={handleSearch}
                        onCategoryChange={handleCategoryFilter}
                        onSupplierChange={handleSupplierFilter}
                        onPriceRangeChange={handlePriceRangeChange}
                        onSortChange={handleSort}
                        onClearFilters={clearFilters}
                    />
                }
            />
        </div>
    )
}