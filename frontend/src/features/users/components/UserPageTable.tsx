import { Table, Button } from 'antd'

interface UserPageTableProps {
    users: any[]
    page: number
    pageSize: number
    totalCount: number
    onEditUser: (user: any) => void
    onDeleteUser: (user: any) => void
    onPaginationChange: (page: number, pageSize: number) => void
}

export const UserPageTable = ({
    users,
    page,
    pageSize,
    totalCount,
    onEditUser,
    onDeleteUser,
    onPaginationChange,
}: UserPageTableProps) => {
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: number) => (role === 0 ? 'Admin' : 'Staff'),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) =>
                new Date(date).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: any) => (
                <span>
                    <Button type="link" onClick={() => onEditUser(record)}>
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => onDeleteUser(record)}
                    >
                        Delete
                    </Button>
                </span>
            ),
        },
    ]

    return (
        <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{
                current: page,
                pageSize: pageSize,
                total: totalCount,
                onChange: onPaginationChange,
            }}
        />
    )
}
