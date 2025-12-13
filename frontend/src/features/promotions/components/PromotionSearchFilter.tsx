import { Card, Row, Col, Space, Typography, Input, Select, Button } from 'antd'
import {
    SearchOutlined,
    SortAscendingOutlined,
    FilterOutlined,
} from '@ant-design/icons'
import type { PromotionStatus } from '../../../config/api.config'

const { Text } = Typography

interface PromotionSearchFilterProps {
    searchText: string
    sortField: string
    sortOrder: 'ascend' | 'descend'
    status?: PromotionStatus
    onSearchChange: (value: string) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onStatusChange: (status: PromotionStatus | undefined) => void
    onClearFilters: () => void
}

export const PromotionSearchFilter = ({
    searchText,
    sortField,
    sortOrder,
    status,
    onSearchChange,
    onSortChange,
    onStatusChange,
    onClearFilters,
}: PromotionSearchFilterProps) => {
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
                        placeholder="Tìm theo mã khuyến mãi hoặc mô tả..."
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
                        value={status}
                        onChange={onStatusChange}
                        placeholder="Tất cả"
                        allowClear
                        style={{ width: '100%', marginTop: '8px' }}
                    >
                        <Select.Option value="active">Đang hoạt động</Select.Option>
                        <Select.Option value="inactive">Không hoạt động</Select.Option>
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
                        <Select.Option value="id-descend">
                            Mới nhất
                        </Select.Option>
                        <Select.Option value="id-ascend">
                            Cũ nhất
                        </Select.Option>
                        <Select.Option value="promoCode-ascend">
                            Mã A-Z
                        </Select.Option>
                        <Select.Option value="promoCode-descend">
                            Mã Z-A
                        </Select.Option>
                        <Select.Option value="startDate-descend">
                            Ngày bắt đầu (mới nhất)
                        </Select.Option>
                        <Select.Option value="startDate-ascend">
                            Ngày bắt đầu (cũ nhất)
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

