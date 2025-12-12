import { Card, Row, Col, Space, Typography, Input, Select, Button, DatePicker } from 'antd'
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'
import { DropDownWithFilter } from '../../../components/common/DropDownWithFilter'
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter'
import { customerApiService } from '../../customers/api/CustomerApiService'
import { userApiService } from '../../users/api/UserApiService'
import type { CustomerEntity } from '../../customers/types/entity'
import type { UserEntity } from '../../users/types/entity'
import type { OrderStatus } from '../../../config/api.config'
import { API_CONFIG } from '../../../config/api.config'
import dayjs, { type Dayjs } from 'dayjs'

const { Text } = Typography
const { RangePicker } = DatePicker

async function fetchCustomerOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await customerApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((c: CustomerEntity) => ({ label: c.name ?? `#${c.id}`, value: c.id }))
}

async function fetchUserOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await userApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((u: UserEntity) => ({ label: u.fullName ?? u.username ?? `#${u.id}`, value: u.id }))
}

interface OrderSearchFilterProps {
    searchText: string
    status?: OrderStatus
    customerId?: number
    userId?: number
    startDate?: string
    endDate?: string
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onStatusFilterChange: (value?: OrderStatus) => void
    onCustomerChange: (value?: number) => void
    onUserChange: (value?: number) => void
    onDateRangeChange: (start?: string, end?: string) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const OrderSearchFilter = ({
    searchText,
    status,
    customerId,
    userId,
    startDate,
    endDate,
    sortField,
    sortOrder,
    onSearchChange,
    onStatusFilterChange,
    onCustomerChange,
    onUserChange,
    onDateRangeChange,
    onSortChange,
    onClearFilters,
}: OrderSearchFilterProps) => {
    const handleSortChange = (value: string) => {
        const [field, order] = value.split('-')
        onSortChange(field, order as 'ascend' | 'descend')
    }

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        if (dates && dates[0] && dates[1]) {
            onDateRangeChange(dates[0].toISOString(), dates[1].toISOString())
        } else {
            onDateRangeChange(undefined, undefined)
        }
    }

    const dateRangeValue = startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null

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
                        placeholder="Tìm theo mã đơn hàng..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={5}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Trạng thái:</Text>
                    </Space>
                    <Select
                        placeholder="Tất cả trạng thái"
                        value={status}
                        onChange={onStatusFilterChange}
                        style={{ width: '100%', marginTop: '8px' }}
                        allowClear
                    >
                        <Select.Option value={API_CONFIG.ORDER_STATUS.PENDING}>Đang chờ</Select.Option>
                        <Select.Option value={API_CONFIG.ORDER_STATUS.PAID}>Đã thanh toán</Select.Option>
                        <Select.Option value={API_CONFIG.ORDER_STATUS.CANCELED}>Đã hủy</Select.Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Khách hàng:</Text>
                    </Space>
                    <DropDownWithFilter
                        placeholder="Tất cả khách hàng"
                        fetchOptions={fetchCustomerOptions}
                        queryKeyPrefix="customer-order-filter"
                        fetchOnEmpty={true}
                        value={customerId}
                        onChange={(v) => onCustomerChange(v as number | undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={5}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Nhân viên:</Text>
                    </Space>
                    <DropDownWithFilter
                        placeholder="Tất cả nhân viên"
                        fetchOptions={fetchUserOptions}
                        queryKeyPrefix="user-order-filter"
                        fetchOnEmpty={true}
                        value={userId}
                        onChange={(v) => onUserChange(v as number | undefined)}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </Col>
                <Col span={3}>
                    <Button
                        onClick={onClearFilters}
                        style={{ marginTop: '32px' }}
                        block
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
            <Row gutter={16} align="middle" style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Khoảng thời gian:</Text>
                    </Space>
                    <RangePicker
                        value={dateRangeValue as [Dayjs, Dayjs] | null}
                        onChange={handleDateRangeChange}
                        style={{ width: '100%', marginTop: '8px' }}
                        showTime
                        format="DD/MM/YYYY HH:mm"
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
                        <Select.Option value="orderDate-descend">
                            Ngày đặt (mới nhất)
                        </Select.Option>
                        <Select.Option value="orderDate-ascend">
                            Ngày đặt (cũ nhất)
                        </Select.Option>
                        <Select.Option value="totalAmount-descend">
                            Tổng tiền (cao đến thấp)
                        </Select.Option>
                        <Select.Option value="totalAmount-ascend">
                            Tổng tiền (thấp đến cao)
                        </Select.Option>
                    </Select>
                </Col>
            </Row>
        </Card>
    )
}

