import { Card, Row, Col, Space, Typography, Input, Select, Button } from 'antd'
import {
    SearchOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'

const { Text } = Typography

interface CategorySearchFilterProps {
    searchText: string
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const CategorySearchFilter = ({
    searchText,
    sortField,
    sortOrder,
    onSearchChange,
    onSortChange,
    onClearFilters,
}: CategorySearchFilterProps) => {
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
                <Col span={12}>
                    <Space>
                        <SearchOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Tìm kiếm:</Text>
                    </Space>
                    <Input.Search
                        placeholder="Tìm theo tên danh mục..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={8}>
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
                        <Select.Option value="categoryName-ascend">
                            Tên A-Z
                        </Select.Option>
                        <Select.Option value="categoryName-descend">
                            Tên Z-A
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

