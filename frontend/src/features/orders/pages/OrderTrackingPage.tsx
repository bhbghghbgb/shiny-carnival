import {
    Card,
    Steps,
    Timeline,
    Typography,
    Space,
    Row,
    Col,
    Tag,
    Descriptions,
} from 'antd'
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons'
import { useParams } from '@tanstack/react-router'
import type { OrderStatus } from '../../../config/api'
// import { getRouteApi } from '@tanstack/react-router'
import { orders as mockOrders } from '../../../_mocks/orders'

const { Title, Text } = Typography
// const routeApi = getRouteApi('/admin/orders/$id')

export const OrderTrackingPage = () => {
    const { id } = useParams({ strict: false })

    // Get order from mock data (for development)
    const orderId = parseInt(id || '1')
    const orderData =
        mockOrders.find((order) => order.id === orderId) || mockOrders[0]

    // TODO: Uncomment below to use API data from route loader
    // const { order: orderData } = routeApi.useLoaderData()

    const orderTracking = {
        ...orderData,
        status: orderData.status as OrderStatus,
        customerName: `Khách hàng #${orderData.customerId}`,
        timeline: [
            {
                time: orderData.orderDate,
                status: 'pending',
                description: 'Đơn hàng đã được tạo',
            },
            ...(orderData.status === 'paid'
                ? [
                      {
                          time: new Date(
                              new Date(orderData.orderDate).getTime() +
                                  30 * 60000
                          ).toISOString(),
                          status: 'paid',
                          description: 'Đơn hàng đã được thanh toán',
                      },
                  ]
                : []),
            ...(orderData.status === 'canceled'
                ? [
                      {
                          time: new Date(
                              new Date(orderData.orderDate).getTime() +
                                  15 * 60000
                          ).toISOString(),
                          status: 'canceled',
                          description: 'Đơn hàng đã bị hủy',
                      },
                  ]
                : []),
        ],
    }

    const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return {
                    color: 'gold',
                    icon: <ClockCircleOutlined />,
                    text: 'Chờ xử lý',
                    step: 0,
                }
            case 'paid':
                return {
                    color: 'green',
                    icon: <CheckCircleOutlined />,
                    text: 'Đã thanh toán',
                    step: 1,
                }
            case 'canceled':
                return {
                    color: 'red',
                    icon: <CloseCircleOutlined />,
                    text: 'Đã hủy',
                    step: -1,
                }
            default:
                return {
                    color: 'default',
                    icon: null,
                    text: status,
                    step: 0,
                }
        }
    }

    const statusConfig = getStatusConfig(orderTracking.status)

    const getStepStatus = (stepIndex: number) => {
        if (statusConfig.step === -1) {
            return 'error'
        }
        if (stepIndex <= statusConfig.step) {
            return 'finish'
        }
        if (stepIndex === statusConfig.step + 1) {
            return 'process'
        }
        return 'wait'
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
                                <ShoppingCartOutlined
                                    style={{
                                        fontSize: '32px',
                                        color: '#1890ff',
                                    }}
                                />
                                <div>
                                    <Title
                                        level={2}
                                        style={{ margin: 0, color: '#1890ff' }}
                                    >
                                        Theo dõi đơn hàng #{orderTracking.id}
                                    </Title>
                                    <Text type="secondary">
                                        Cập nhật lúc:{' '}
                                        {new Date().toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Tag
                                color={statusConfig.color}
                                icon={statusConfig.icon}
                                style={{
                                    borderRadius: '12px',
                                    padding: '8px 16px',
                                    fontSize: '16px',
                                }}
                            >
                                {statusConfig.text}
                            </Tag>
                        </Col>
                    </Row>
                </Card>

                {/* Order Info */}
                <Card
                    title="Thông tin đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Descriptions column={2}>
                        <Descriptions.Item label="Mã đơn hàng">
                            <Text strong>#{orderTracking.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Khách hàng">
                            {orderTracking.customerName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt">
                            {new Date(orderTracking.orderDate).toLocaleString(
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
                        <Descriptions.Item label="Tổng tiền">
                            <Text
                                strong
                                style={{ color: '#52c41a', fontSize: '16px' }}
                            >
                                {orderTracking.totalAmount.toLocaleString(
                                    'vi-VN'
                                )}{' '}
                                ₫
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Order Status Steps */}
                <Card
                    title="Trạng thái đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Steps
                        current={statusConfig.step}
                        status={statusConfig.step === -1 ? 'error' : 'process'}
                        items={[
                            {
                                title: 'Chờ xử lý',
                                description: 'Đơn hàng đang chờ xác nhận',
                                icon: <ClockCircleOutlined />,
                                status: getStepStatus(0),
                            },
                            {
                                title: 'Đã thanh toán',
                                description: 'Đơn hàng đã được thanh toán',
                                icon: <CheckCircleOutlined />,
                                status: getStepStatus(1),
                            },
                        ]}
                    />
                </Card>

                {/* Timeline */}
                <Card
                    title="Lịch sử đơn hàng"
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Timeline
                        items={orderTracking.timeline.map((event) => {
                            const config = getStatusConfig(
                                event.status as OrderStatus
                            )
                            return {
                                color:
                                    config.color === 'gold'
                                        ? 'blue'
                                        : config.color,
                                children: (
                                    <div>
                                        <Space direction="vertical" size={4}>
                                            <Text strong>
                                                {event.description}
                                            </Text>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: '12px' }}
                                            >
                                                {new Date(
                                                    event.time
                                                ).toLocaleString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Text>
                                        </Space>
                                    </div>
                                ),
                            }
                        })}
                    />
                </Card>
            </Space>
        </div>
    )
}
