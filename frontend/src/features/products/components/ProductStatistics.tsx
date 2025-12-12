import { Card, Row, Col, Statistic } from 'antd'
import { ShoppingOutlined, WarningOutlined } from '@ant-design/icons'

interface ProductStatisticsProps {
    totalProducts: number
    lowStock: string | number
}

export const ProductStatistics = ({
    totalProducts,
    lowStock,
}: ProductStatisticsProps) => {
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
                        title="Tổng sản phẩm (trên bảng)"
                        value={totalProducts}
                        prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
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
                        title="Tồn kho thấp"
                        value={typeof lowStock === 'number' ? lowStock : 'Chờ API'}
                        prefix={<WarningOutlined style={{ color: '#faad14' }} />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

