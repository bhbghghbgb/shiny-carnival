import { Card, Row, Col, Statistic } from 'antd'
import { ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons'

interface OrderStatisticsProps {
    totalOrders: number
    totalRevenue: number | string
}

export const OrderStatistics = ({
    totalOrders,
    totalRevenue,
}: OrderStatisticsProps) => {
    return (
        <Row gutter={16}>
            <Col span={12}>
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
                        prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col span={12}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Tổng doanh thu"
                        value={typeof totalRevenue === 'number' ? totalRevenue : 'Chờ API'}
                        prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                        valueStyle={{ color: '#52c41a' }}
                        formatter={(value) => {
                            if (typeof value === 'number') {
                                return `${value.toLocaleString()} đ`
                            }
                            return value
                        }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

