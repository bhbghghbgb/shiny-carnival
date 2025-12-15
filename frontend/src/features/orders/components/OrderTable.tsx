import { Table, Card, Space, Typography, Tag, Button, Tooltip } from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'
import type { OrderEntity } from '../types/entity'
import type { OrderStatus } from '../../../config/api'

const { Text } = Typography

interface OrderTableProps {
    orders: OrderEntity[]
    onViewOrder: (order: OrderEntity) => void
    onEditOrder: (order: OrderEntity) => void
    onDeleteOrder: (order: OrderEntity) => void
    loading?: boolean
}

export const OrderTable = ({
    orders,
    onViewOrder,
    onEditOrder,
    onDeleteOrder,
    loading = false,
}: OrderTableProps) => {
    const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'gold',
                    icon: <ClockCircleOutlined />,
                    text: 'Chờ xử lý',
                }
            case 'paid':
                return {
                    color: 'green',
                    icon: <CheckCircleOutlined />,
                    text: 'Đã thanh toán',
                }
            case 'canceled':
                return {
                    color: 'red',
                    icon: <CloseCircleOutlined />,
                    text: 'Đã hủy',
                }
            default:
                return {
                    color: 'default',
                    icon: null,
                    text: status,
                }
        }
    }

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => (
                <Text strong style={{ color: '#1890ff' }}>
                    #{id}
                </Text>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date: string) => (
                <Text type="secondary">
                    {new Date(date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            ),
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerId',
            key: 'customerId',
            render: (customerId: number) => (
                <Text>Khách hàng #{customerId}</Text>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: OrderStatus) => {
                const config = getStatusConfig(status)
                return (
                    <Tag
                        color={config.color}
                        icon={config.icon}
                        style={{ borderRadius: '12px', padding: '4px 12px' }}
                    >
                        {config.text}
                    </Tag>
                )
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {amount.toLocaleString('vi-VN')} ₫
                </Text>
            ),
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            render: (amount: number) => (
                <Text type="secondary">
                    {amount > 0 ? `${amount.toLocaleString('vi-VN')} ₫` : '-'}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: OrderEntity) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="default"
                            shape="circle"
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => onViewOrder(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEditOrder(record)}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => onDeleteOrder(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} đơn hàng`,
                    style: { marginTop: '16px' },
                }}
                style={{
                    borderRadius: '8px',
                }}
            />
        </Card>
    )
}
