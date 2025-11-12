import { Card, Row, Col, Statistic } from 'antd'
import { TeamOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons'

interface UserStatisticsProps {
    totalUsers: number
    adminCount: number
    staffCount: number
}

export const UserStatistics = ({
    totalUsers,
    adminCount,
    staffCount,
}: UserStatisticsProps) => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Tổng người dùng (trên bảng)"
                        value={totalUsers}
                        prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Quản trị viên (trên bảng)"
                        value={adminCount}
                        prefix={<CrownOutlined style={{ color: '#faad14' }} />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Nhân viên (trên bảng)"
                        value={staffCount}
                        prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}
