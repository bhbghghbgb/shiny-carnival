import { Card, Row, Col, Space, Typography, Input, InputNumber, Select, Button } from 'antd'
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'
import { DropDownWithFilter } from '../../../components/common/DropDownWithFilter'
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter'
import { categoryApiService } from '../../categories/api'
import { supplierApiService } from '../../suppliers/api'
import type { CategoryEntity } from '../../categories/types/entity'
import type { SupplierEntity } from '../../suppliers/types/entity'

const { Text } = Typography

async function fetchCategoryOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await categoryApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((c: CategoryEntity) => ({ label: c.categoryName ?? `#${c.id}`, value: c.id }))
}

async function fetchSupplierOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await supplierApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((s: SupplierEntity) => ({ label: s.name ?? `#${s.id}`, value: s.id }))
}

interface ProductSearchFilterProps {
    searchText: string
    categoryId?: number
    supplierId?: number
    minPrice?: number
    maxPrice?: number
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onCategoryChange: (value?: number) => void
    onSupplierChange: (value?: number) => void
    onPriceRangeChange: (min?: number, max?: number) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const ProductSearchFilter = ({
    searchText,
    categoryId,
    supplierId,
    minPrice,
    maxPrice,
    sortField,
    sortOrder,
    onSearchChange,
    onCategoryChange,
    onSupplierChange,
    onPriceRangeChange,
    onSortChange,
    onClearFilters,
}: ProductSearchFilterProps) => {
    const handleSortChange = (value: string) => {
        const [field, order] = value.split('-')
        onSortChange(field, order as 'ascend' | 'descend')
    }

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row gutter={16} align="middle">
                <Col span={6}>
                    <Space>
                        <SearchOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Tìm kiếm:</Text>
                    </Space>
                    <Input.Search
                        placeholder="Tìm theo tên hoặc barcode..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={5}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Danh mục:</Text>
                    </Space>
                    <DropDownWithFilter
                        placeholder="Tất cả danh mục"
                        fetchOptions={fetchCategoryOptions}
                        queryKeyPrefix="category-filter"
                        fetchOnEmpty={true}
                        value={categoryId}
                        onChange={(v) => onCategoryChange(v as number | undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={5}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Nhà cung cấp:</Text>
                    </Space>
                    <DropDownWithFilter
                        placeholder="Tất cả nhà cung cấp"
                        fetchOptions={fetchSupplierOptions}
                        queryKeyPrefix="supplier-filter"
                        fetchOnEmpty={true}
                        value={supplierId}
                        onChange={(v) => onSupplierChange(v as number | undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={4}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Giá từ:</Text>
                    </Space>
                    <InputNumber
                        placeholder="Giá từ"
                        value={minPrice}
                        min={0}
                        onChange={(value) => onPriceRangeChange(value ?? undefined, maxPrice)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={4}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Giá đến:</Text>
                    </Space>
                    <InputNumber
                        placeholder="Giá đến"
                        value={maxPrice}
                        min={0}
                        onChange={(value) => onPriceRangeChange(minPrice, value ?? undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginTop: '16px' }}>
                <Col span={6}>
                    <Space>
                        <SortAscendingOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Sắp xếp:</Text>
                    </Space>
                    <Select
                        value={`${sortField}-${sortOrder}`}
                        onChange={handleSortChange}
                        style={{ width: '100%', marginTop: '8px' }}
                    >
                        <Select.Option value="id-descend">
                            Mới nhất
                        </Select.Option>
                        <Select.Option value="id-ascend">
                            Cũ nhất
                        </Select.Option>
                        <Select.Option value="productName-ascend">
                            Tên A-Z
                        </Select.Option>
                        <Select.Option value="productName-descend">
                            Tên Z-A
                        </Select.Option>
                        <Select.Option value="price-ascend">
                            Giá thấp đến cao
                        </Select.Option>
                        <Select.Option value="price-descend">
                            Giá cao đến thấp
                        </Select.Option>
                        <Select.Option value="createdAt-descend">
                            Ngày tạo (mới nhất)
                        </Select.Option>
                        <Select.Option value="createdAt-ascend">
                            Ngày tạo (cũ nhất)
                        </Select.Option>
                    </Select>
                </Col>
                <Col span={18}>
                    <Button
                        onClick={onClearFilters}
                        style={{ marginTop: '32px' }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

