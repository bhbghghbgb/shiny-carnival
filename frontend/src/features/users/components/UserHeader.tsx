import { Button, Card, Row, Col, Space, Typography } from 'antd'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface UserHeaderProps {
    onAddUser: () => void
}

export const UserHeader = ({ onAddUser }: UserHeaderProps) => {
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
                            <TeamOutlined style={{ marginRight: '8px' }} />
                            Quản lý người dùng
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin và quyền hạn của người dùng trong
                            hệ thống
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={onAddUser}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Thêm
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}
