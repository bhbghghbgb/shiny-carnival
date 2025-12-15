import {
    Table,
    Card,
    Space,
    Typography,
    Tag,
    Avatar,
    Button,
    Tooltip,
} from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    CrownOutlined,
} from '@ant-design/icons'
import type { UserNoPass } from '../types/entity'

const { Text } = Typography

interface UserTableProps {
    users: UserNoPass[]
    onEditUser: (user: UserNoPass) => void
    onDeleteUser: (user: UserNoPass) => void
}

export const UserTable = ({
    users,
    onEditUser,
    onDeleteUser,
}: UserTableProps) => {
    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (record: UserNoPass) => (
                <Space>
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor:
                                record.role === 0 ? '#faad14' : '#52c41a',
                            border: '2px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>
                            {record.fullName}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            @{record.username}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: number) => (
                <Tag
                    color={role === 0 ? 'gold' : 'green'}
                    icon={role === 0 ? <CrownOutlined /> : <UserOutlined />}
                    style={{ borderRadius: '12px', padding: '4px 12px' }}
                >
                    {role === 0 ? 'Admin' : 'Staff'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => (
                <Text type="secondary">
                    {new Date(date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: UserNoPass) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEditUser(record)}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => onDeleteUser(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} người dùng`,
                    style: { marginTop: '16px' },
                }}
                style={{
                    borderRadius: '8px',
                }}
            />
        </Card>
    )
}
