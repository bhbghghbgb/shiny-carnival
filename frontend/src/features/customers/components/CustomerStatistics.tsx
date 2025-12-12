import { Card, Row, Col, Statistic } from 'antd'
import { UserOutlined } from '@ant-design/icons'

interface CustomerStatisticsProps {
    totalCustomers: number
}

export const CustomerStatistics = ({
    totalCustomers,
}: CustomerStatisticsProps) => {
    return (
        <Row gutter={16}>
            <Col span={24}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Tổng khách hàng (trên bảng)"
                        value={totalCustomers}
                        prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

