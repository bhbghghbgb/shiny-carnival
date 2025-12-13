import { Card, Row, Col, Space, Typography } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export const InventoryHeader = () => {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size="small">
                        <Title
                            level={2}
                            style={{ margin: 0, color: '#1890ff' }}
                        >
                            <DatabaseOutlined style={{ marginRight: '8px' }} />
                            Quản lý tồn kho
                        </Title>
                        <Text type="secondary">
                            Quản lý số lượng tồn kho và lịch sử thay đổi
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}

