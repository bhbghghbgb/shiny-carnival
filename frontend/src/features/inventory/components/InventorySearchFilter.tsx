import { Card, Row, Col, Space, Typography, Input, InputNumber, Select, Button } from 'antd'
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'
import { DropDownWithFilter } from '../../../components/common/DropDownWithFilter'
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter'
import { productApiService } from '../../products/api/ProductApiService'
import type { ProductEntity } from '../../products/types/entity'

const { Text } = Typography

async function fetchProductOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await productApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((p: ProductEntity) => ({ label: p.productName ?? `#${p.id}`, value: p.id }))
}

interface InventorySearchFilterProps {
    searchText: string
    productId?: number
    minQuantity?: number
    maxQuantity?: number
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onProductChange: (value?: number) => void
    onQuantityRangeChange: (min?: number, max?: number) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const InventorySearchFilter = ({
    searchText,
    productId,
    minQuantity,
    maxQuantity,
    sortField,
    sortOrder,
    onSearchChange,
    onProductChange,
    onQuantityRangeChange,
    onSortChange,
    onClearFilters,
}: InventorySearchFilterProps) => {
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
                        placeholder="Tìm theo tên sản phẩm..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={5}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Sản phẩm:</Text>
                    </Space>
                    <DropDownWithFilter
                        placeholder="Tất cả sản phẩm"
                        fetchOptions={fetchProductOptions}
                        queryKeyPrefix="product-inventory-filter"
                        fetchOnEmpty={true}
                        value={productId}
                        onChange={(v) => onProductChange(v as number | undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={4}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Số lượng từ:</Text>
                    </Space>
                    <InputNumber
                        placeholder="Từ"
                        value={minQuantity}
                        min={0}
                        onChange={(value) => onQuantityRangeChange(value ?? undefined, maxQuantity)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={4}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Đến:</Text>
                    </Space>
                    <InputNumber
                        placeholder="Đến"
                        value={maxQuantity}
                        min={0}
                        onChange={(value) => onQuantityRangeChange(minQuantity, value ?? undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={5}>
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
                        <Select.Option value="quantity-descend">
                            Số lượng (cao đến thấp)
                        </Select.Option>
                        <Select.Option value="quantity-ascend">
                            Số lượng (thấp đến cao)
                        </Select.Option>
                    </Select>
                </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Button
                        onClick={onClearFilters}
                        block
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

