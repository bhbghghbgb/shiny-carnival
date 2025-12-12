import { Card, Row, Col, Statistic } from 'antd'
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons'

interface PromotionStatisticsProps {
    totalPromotions: number
    activePromotions: number
}

export const PromotionStatistics = ({
    totalPromotions,
    activePromotions,
}: PromotionStatisticsProps) => {
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
                        title="Tổng khuyến mãi (trên bảng)"
                        value={totalPromotions}
                        prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
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
                        title="Khuyến mãi đang hoạt động"
                        value={activePromotions}
                        prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

