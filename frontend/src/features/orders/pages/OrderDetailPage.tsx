import {
    Card,
    Descriptions,
    Table,
    Tag,
    Button,
    Space,
    Typography,
    Row,
    Col,
    Divider,
} from 'antd'
import {
    ArrowLeftOutlined,
    EditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    PrinterOutlined,
    EyeOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from '@tanstack/react-router'
import type { OrderStatus } from '../../../config/api'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
// import { getRouteApi } from '@tanstack/react-router'
import { orders as mockOrders } from '../../../_mocks/orders'

const { Title, Text } = Typography
// const routeApi = getRouteApi('/admin/orders/$id')

export const OrderDetailPage = () => {
    const navigate = useNavigate()
    const { id } = useParams({ strict: false })

    // Get order from mock data (for development)
    const orderId = parseInt(id || '1')
    const orderData =
        mockOrders.find((order) => order.id === orderId) || mockOrders[0]

    // TODO: Uncomment below to use API data from route loader
    // const { order: orderData } = routeApi.useLoaderData()

    const orderDetails = {
        ...orderData,
        status: orderData.status as OrderStatus,
        customerName: `Khách hàng #${orderData.customerId}`,
        userName: `Nhân viên #${orderData.userId}`,
        promoCode: orderData.promoId ? `PROMO${orderData.promoId}` : undefined,
    }

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

    const statusConfig = getStatusConfig(orderDetails.status)

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (subtotal: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {subtotal.toLocaleString('vi-VN')} ₫
                </Text>
            ),
        },
    ]

    const handleBack = () => {
        navigate({ to: ENDPOINTS.ADMIN.ORDERS.LIST })
    }

    const handleEdit = () => {
        navigate({
            to: ENDPOINTS.ADMIN.ORDERS.EDIT,
            params: { id: id || '1' },
        })
    }

    const handlePrint = () => {
        // TODO: Implement print functionality
        console.log('Print invoice')
    }

    const handleTracking = () => {
        navigate({
            to: ENDPOINTS.ADMIN.ORDERS.TRACKING,
            params: { id: id || '1' },
        })
    }

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={handleBack}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Quay lại
                                </Button>
                                <Title
                                    level={2}
                                    style={{ margin: 0, color: '#1890ff' }}
                                >
                                    Chi tiết đơn hàng #{orderDetails.id}
                                </Title>
                                <Tag
                                    color={statusConfig.color}
                                    icon={statusConfig.icon}
                                    style={{
                                        borderRadius: '12px',
                                        padding: '4px 12px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {statusConfig.text}
                                </Tag>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={handleTracking}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Theo dõi
                                </Button>
                                <Button
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}
                                    style={{ borderRadius: '8px' }}
                                >
                                    In hóa đơn
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleEdit}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Chỉnh sửa
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Order Information */}
                <Card
                    title="Thông tin đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Mã đơn hàng">
                            <Text strong>#{orderDetails.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt">
                            {new Date(orderDetails.orderDate).toLocaleString(
                                'vi-VN',
                                {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Khách hàng">
                            {orderDetails.customerName} (ID:{' '}
                            {orderDetails.customerId})
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhân viên">
                            {orderDetails.userName} (ID: {orderDetails.userId})
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã khuyến mãi">
                            {orderDetails.promoCode || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag
                                color={statusConfig.color}
                                icon={statusConfig.icon}
                                style={{
                                    borderRadius: '12px',
                                    padding: '4px 12px',
                                }}
                            >
                                {statusConfig.text}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Order Items */}
                <Card
                    title="Chi tiết sản phẩm"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Table
                        dataSource={orderDetails.orderItems}
                        columns={columns}
                        rowKey="orderItemId"
                        pagination={false}
                        style={{ borderRadius: '8px' }}
                    />

                    <Divider />

                    {/* Summary */}
                    <Row justify="end">
                        <Col span={8}>
                            <Space
                                direction="vertical"
                                style={{ width: '100%' }}
                                size="middle"
                            >
                                <Row justify="space-between">
                                    <Text>Tạm tính:</Text>
                                    <Text strong>
                                        {(
                                            orderDetails.totalAmount +
                                            orderDetails.discountAmount
                                        ).toLocaleString('vi-VN')}{' '}
                                        ₫
                                    </Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text>Giảm giá:</Text>
                                    <Text strong style={{ color: '#ff4d4f' }}>
                                        -
                                        {orderDetails.discountAmount.toLocaleString(
                                            'vi-VN'
                                        )}{' '}
                                        ₫
                                    </Text>
                                </Row>
                                <Divider style={{ margin: '8px 0' }} />
                                <Row justify="space-between">
                                    <Title level={4} style={{ margin: 0 }}>
                                        Tổng cộng:
                                    </Title>
                                    <Title
                                        level={4}
                                        style={{ margin: 0, color: '#52c41a' }}
                                    >
                                        {orderDetails.totalAmount.toLocaleString(
                                            'vi-VN'
                                        )}{' '}
                                        ₫
                                    </Title>
                                </Row>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </div>
    )
}
