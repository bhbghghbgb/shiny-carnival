import { Card, Row, Col, Statistic } from 'antd'
import { FolderOutlined } from '@ant-design/icons'

interface CategoryStatisticsProps {
    totalCategories: number
}

export const CategoryStatistics = ({
    totalCategories,
}: CategoryStatisticsProps) => {
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
                        title="Tổng danh mục (trên bảng)"
                        value={totalCategories}
                        prefix={<FolderOutlined style={{ color: '#1890ff' }} />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}

