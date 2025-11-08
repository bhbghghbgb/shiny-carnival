import {
    Card,
    Form,
    Button,
    Space,
    Typography,
    Row,
    Col,
    Select,
    message,
    Tag,
} from 'antd'
import {
    ArrowLeftOutlined,
    SaveOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from '@tanstack/react-router'
import type { OrderStatus } from '../../../config/api'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
// import { getRouteApi } from '@tanstack/react-router'
import {
    orders as mockOrders,
    updateMockOrderStatus,
} from '../../../_mocks/orders'
import { emitOrdersChanged } from '../utils/orderEvents'

const { Title, Text } = Typography
// const routeApi = getRouteApi('/admin/orders/$id')

export const OrderEditPage = () => {
    const navigate = useNavigate()
    const { id } = useParams({ strict: false })
    const [form] = Form.useForm()

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

    const currentStatusConfig = getStatusConfig(orderDetails.status)

    const handleSubmit = async (values: any) => {
        try {
            // Development: update mock status
            const updated = updateMockOrderStatus(orderId, values.status)
            if (!updated) {
                message.error('Không tìm thấy đơn hàng!')
                return
            }
            emitOrdersChanged()
            message.success('Cập nhật trạng thái đơn hàng thành công!')
            navigate({
                to: ENDPOINTS.ADMIN.ORDERS.DETAIL,
                params: { id: orderId.toString() },
            })
        } catch (error) {
            message.error('Không thể cập nhật trạng thái đơn hàng!')
            console.error('Update order error:', error)
        }
    }

    const handleBack = () => {
        navigate({
            to: ENDPOINTS.ADMIN.ORDERS.DETAIL,
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
                                    Chỉnh sửa đơn hàng #{orderDetails.id}
                                </Title>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Order Summary */}
                <Card
                    title="Thông tin đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Space direction="vertical">
                                <Text type="secondary">Khách hàng:</Text>
                                <Text strong>{orderDetails.customerName}</Text>
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction="vertical">
                                <Text type="secondary">Ngày đặt:</Text>
                                <Text strong>
                                    {new Date(
                                        orderDetails.orderDate
                                    ).toLocaleString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Text>
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction="vertical">
                                <Text type="secondary">Tổng tiền:</Text>
                                <Text
                                    strong
                                    style={{
                                        color: '#52c41a',
                                        fontSize: '18px',
                                    }}
                                >
                                    {orderDetails.totalAmount.toLocaleString(
                                        'vi-VN'
                                    )}{' '}
                                    ₫
                                </Text>
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction="vertical">
                                <Text type="secondary">
                                    Trạng thái hiện tại:
                                </Text>
                                <Tag
                                    color={currentStatusConfig.color}
                                    icon={currentStatusConfig.icon}
                                    style={{
                                        borderRadius: '12px',
                                        padding: '4px 12px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {currentStatusConfig.text}
                                </Tag>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Products List */}
                <Card
                    title="Sản phẩm trong đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Space
                        direction="vertical"
                        style={{ width: '100%' }}
                        size="middle"
                    >
                        {orderDetails.orderItems.map((item, index) => (
                            <Card
                                key={index}
                                type="inner"
                                size="small"
                                style={{ borderRadius: '8px' }}
                            >
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Space>
                                            <Text strong>
                                                {item.productName}
                                            </Text>
                                            <Text type="secondary">
                                                x {item.quantity}
                                            </Text>
                                        </Space>
                                    </Col>
                                    <Col>
                                        <Text
                                            strong
                                            style={{ color: '#52c41a' }}
                                        >
                                            {(
                                                item.price * item.quantity
                                            ).toLocaleString('vi-VN')}{' '}
                                            ₫
                                        </Text>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Space>
                </Card>

                {/* Status Update Form */}
                <Card
                    title="Cập nhật trạng thái"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ status: orderDetails.status }}
                    >
                        <Form.Item
                            name="status"
                            label="Trạng thái mới"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái!',
                                },
                            ]}
                        >
                            <Select
                                size="large"
                                placeholder="Chọn trạng thái mới"
                            >
                                <Select.Option value="pending">
                                    <Space>
                                        <ClockCircleOutlined
                                            style={{ color: '#faad14' }}
                                        />
                                        Chờ xử lý
                                    </Space>
                                </Select.Option>
                                <Select.Option value="paid">
                                    <Space>
                                        <CheckCircleOutlined
                                            style={{ color: '#52c41a' }}
                                        />
                                        Đã thanh toán
                                    </Space>
                                </Select.Option>
                                <Select.Option value="canceled">
                                    <Space>
                                        <CloseCircleOutlined
                                            style={{ color: '#ff4d4f' }}
                                        />
                                        Đã hủy
                                    </Space>
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Row justify="end" gutter={16}>
                                <Col>
                                    <Button
                                        onClick={handleBack}
                                        size="large"
                                        style={{ borderRadius: '8px' }}
                                    >
                                        Hủy
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        icon={<SaveOutlined />}
                                        style={{ borderRadius: '8px' }}
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </div>
    )
}
