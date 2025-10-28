import { Card, Row, Col, Space, Typography, Input, Select, Button } from 'antd'
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'

const { Text } = Typography

interface UserSearchFilterProps {
    searchText: string
    roleFilter: number | undefined
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onRoleFilterChange: (value: number | undefined) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const UserSearchFilter = ({
    searchText,
    roleFilter,
    sortField,
    sortOrder,
    onSearchChange,
    onRoleFilterChange,
    onSortChange,
    onClearFilters,
}: UserSearchFilterProps) => {
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
                        placeholder="Tìm theo tên hoặc username..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={6}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Vai trò:</Text>
                    </Space>
                    <Select
                        placeholder="Tất cả vai trò"
                        value={roleFilter}
                        onChange={onRoleFilterChange}
                        style={{ width: '100%', marginTop: '8px' }}
                        allowClear
                    >
                        <Select.Option value={0}>Admin</Select.Option>
                        <Select.Option value={1}>Staff</Select.Option>
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
                        <Select.Option value="createdAt-descend">
                            Mới nhất
                        </Select.Option>
                        <Select.Option value="createdAt-ascend">
                            Cũ nhất
                        </Select.Option>
                        <Select.Option value="fullName-ascend">
                            Tên A-Z
                        </Select.Option>
                        <Select.Option value="fullName-descend">
                            Tên Z-A
                        </Select.Option>
                        <Select.Option value="username-ascend">
                            Username A-Z
                        </Select.Option>
                        <Select.Option value="username-descend">
                            Username Z-A
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
