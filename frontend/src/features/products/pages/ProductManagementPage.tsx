async function fetchCategoryOptions(keyword: string) {
    const paged = await categoryApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((c: CategoryEntity) => ({
        label: c.categoryName ?? `#${c.id}`,
        value: c.id,
    }))
}

async function fetchSupplierOptions(keyword: string) {
    const paged = await supplierApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((s: SupplierEntity) => ({
        label: s.name ?? `#${s.id}`,
        value: s.id,
    }))
}
import { Card, Input, InputNumber, Space, Typography } from 'antd'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { productPageConfig } from '../config/productPageConfig'
import { useProductManagementPage } from '../hooks/useProductManagementPage'
import type { ProductEntity } from '../types/entity'
import type { CreateProductRequest, UpdateProductRequest } from '../types/api'
import { DropDownWithFilter } from '../../../components/common/DropDownWithFilter'
import { categoryApiService } from '../../categories/api'
import { supplierApiService } from '../../suppliers/api'
import type { CategoryEntity } from '../../categories/types/entity'
import type { SupplierEntity } from '../../suppliers/types/entity'

const { Title } = Typography

type ProductFiltersProps = {
    searchText: string
    categoryId?: number
    supplierId?: number
    minPrice?: number
    maxPrice?: number
    onSearchChange: (value: string) => void
    onCategoryChange: (value?: number) => void
    onSupplierChange: (value?: number) => void
    onPriceRangeChange: (min?: number, max?: number) => void
    onClearFilters: () => void
}

const ProductFilters = ({
    searchText,
    categoryId,
    supplierId,
    minPrice,
    maxPrice,
    onSearchChange,
    onCategoryChange,
    onSupplierChange,
    onPriceRangeChange,
    onClearFilters,
}: ProductFiltersProps) => {
    return (
        <Card size="small" title="Bộ lọc">
            <Space wrap style={{ width: '100%' }}>
                <Input
                    placeholder="Tìm theo tên hoặc barcode"
                    allowClear
                    style={{ width: 240 }}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <DropDownWithFilter
                    style={{ width: 220 }}
                    placeholder="Chọn danh mục"
                    fetchOptions={fetchCategoryOptions}
                    queryKeyPrefix="category-filter"
                    fetchOnEmpty={true}
                    value={categoryId}
                    onChange={(v) => onCategoryChange(v as number | undefined)}
                />
                <DropDownWithFilter
                    style={{ width: 220 }}
                    placeholder="Chọn nhà cung cấp"
                    fetchOptions={fetchSupplierOptions}
                    queryKeyPrefix="supplier-filter"
                    fetchOnEmpty={true}
                    value={supplierId}
                    onChange={(v) => onSupplierChange(v as number | undefined)}
                />
                <InputNumber
                    placeholder="Giá từ"
                    style={{ width: 140 }}
                    value={minPrice}
                    min={0}
                    onChange={(value) => onPriceRangeChange(value ?? undefined, maxPrice)}
                />
                <InputNumber
                    placeholder="Giá đến"
                    style={{ width: 140 }}
                    value={maxPrice}
                    min={0}
                    onChange={(value) => onPriceRangeChange(minPrice, value ?? undefined)}
                />
                <a onClick={onClearFilters}>Xóa lọc</a>
            </Space>
        </Card>
    )
}

const ProductStatistics = ({ total, lowStock }: { total: number; lowStock: string | number }) => (
    <Space wrap>
        <Card size="small" title="Tổng sản phẩm">
            <Title level={4} style={{ margin: 0 }}>
                {total}
            </Title>
        </Card>
        <Card size="small" title="Tồn kho thấp">
            <Title level={4} style={{ margin: 0 }}>
                {lowStock}
            </Title>
        </Card>
    </Space>
)

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
                renderHeader={() => (
                    <Title level={3} style={{ margin: 0 }}>
                        Quản lý sản phẩm
                    </Title>
                )}
                statisticsSlot={
                    <ProductStatistics
                        total={total}
                        lowStock={placeholderStats.lowStock}
                    />
                }
                filtersSlot={
                    <ProductFilters
                        searchText={searchText}
                        categoryId={categoryId}
                        supplierId={supplierId}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onSearchChange={handleSearch}
                        onCategoryChange={handleCategoryFilter}
                        onSupplierChange={handleSupplierFilter}
                        onPriceRangeChange={handlePriceRangeChange}
                        onClearFilters={clearFilters}
                    />
                }
            />
        </div>
    )
}