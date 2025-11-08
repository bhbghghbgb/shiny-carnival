import { Card, Row, Col, Statistic } from 'antd'
import {
    ShoppingOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons'

interface OrderStatisticsProps {
    totalOrders: number
    pendingCount: number
    paidCount: number
    canceledCount: number
}

export const OrderStatistics = ({
    totalOrders,
    pendingCount,
    paidCount,
    canceledCount,
}: OrderStatisticsProps) => {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Tổng đơn hàng (trên bảng)"
                        value={totalOrders}
                        prefix={
                            <ShoppingOutlined style={{ color: '#1890ff' }} />
                        }
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Chờ xử lý (trên bảng)"
                        value={pendingCount}
                        prefix={
                            <ClockCircleOutlined style={{ color: '#faad14' }} />
                        }
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Đã thanh toán (trên bảng)"
                        value={paidCount}
                        prefix={
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        }
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Đã hủy (trên bảng)"
                        value={canceledCount}
                        prefix={
                            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                        }
                        valueStyle={{ color: '#ff4d4f' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}
