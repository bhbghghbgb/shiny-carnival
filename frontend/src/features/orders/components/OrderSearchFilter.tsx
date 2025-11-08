import { Card, Row, Col, Space, Typography, Input, Select, Button } from 'antd'
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'
import type { OrderStatus } from '../../../config/api'

const { Text } = Typography

interface OrderSearchFilterProps {
    searchText: string
    statusFilter: OrderStatus | undefined
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onStatusFilterChange: (value: OrderStatus | undefined) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const OrderSearchFilter = ({
    searchText,
    statusFilter,
    sortField,
    sortOrder,
    onSearchChange,
    onStatusFilterChange,
    onSortChange,
    onClearFilters,
}: OrderSearchFilterProps) => {
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
                <Col span={8}>
                    <Space>
                        <SearchOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Tìm kiếm:</Text>
                    </Space>
                    <Input.Search
                        placeholder="Tìm theo mã đơn hàng hoặc khách hàng..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={6}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Trạng thái:</Text>
                    </Space>
                    <Select
                        placeholder="Tất cả trạng thái"
                        value={statusFilter}
                        onChange={onStatusFilterChange}
                        style={{ width: '100%', marginTop: '8px' }}
                        allowClear
                    >
                        <Select.Option value="pending">Chờ xử lý</Select.Option>
                        <Select.Option value="paid">
                            Đã thanh toán
                        </Select.Option>
                        <Select.Option value="canceled">Đã hủy</Select.Option>
                    </Select>
                </Col>
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
                        <Select.Option value="orderDate-descend">
                            Mới nhất
                        </Select.Option>
                        <Select.Option value="orderDate-ascend">
                            Cũ nhất
                        </Select.Option>
                        <Select.Option value="totalAmount-descend">
                            Giá cao nhất
                        </Select.Option>
                        <Select.Option value="totalAmount-ascend">
                            Giá thấp nhất
                        </Select.Option>
                        <Select.Option value="id-descend">
                            Mã đơn giảm dần
                        </Select.Option>
                        <Select.Option value="id-ascend">
                            Mã đơn tăng dần
                        </Select.Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Button
                        onClick={onClearFilters}
                        style={{ marginTop: '32px' }}
                        block
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}
