import { Card, Row, Col, Statistic } from 'antd'
import { DatabaseOutlined, WarningOutlined } from '@ant-design/icons'

interface InventoryStatisticsProps {
    totalItems: number
    lowStockCount: number | string
}

export const InventoryStatistics = ({
    totalItems,
    lowStockCount,
}: InventoryStatisticsProps) => {
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
                        title="Tổng sản phẩm có tồn kho"
                        value={totalItems}
                        prefix={<DatabaseOutlined style={{ color: '#1890ff' }} />}
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
                        title="Sản phẩm tồn kho thấp"
                        value={typeof lowStockCount === 'number' ? lowStockCount : 'Chờ API'}
                        prefix={<WarningOutlined style={{ color: '#faad14' }} />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

