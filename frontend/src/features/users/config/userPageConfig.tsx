import type { ColumnsType } from 'antd/es/table'
import type { UserNoPass } from '../types/entity'
import type { CreateUserRequest, UpdateUserRequest } from '../types/api'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import { Tag } from 'antd'

const roleLabel = (role?: number) => {
    if (role === 0) return { text: 'Admin', color: 'geekblue' as const }
    if (role === 1) return { text: 'Staff', color: 'green' as const }
    return { text: 'Unknown', color: 'default' as const }
}

const columns: ColumnsType<UserNoPass> = [
    {
        title: 'Username',
        dataIndex: 'username',
        sorter: true,
    },
    {
        title: 'Họ tên',
        dataIndex: 'fullName',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        render: (value: number) => {
            const r = roleLabel(value)
            return <Tag color={r.color}>{r.text}</Tag>
        },
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        sorter: true,
        render: (value?: string | Date) => {
            if (!value) return '--'
            const date = typeof value === 'string' ? new Date(value) : value
            return date.toLocaleString()
        },
    },
]

export const userPageConfig: GenericPageConfig<UserNoPass, CreateUserRequest, UpdateUserRequest> = {
    entity: {
        name: 'users',
        displayName: 'User',
        displayNamePlural: 'Users',
    },
    table: {
        columns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'username',
                label: 'Username',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập username' }],
            },
            {
                name: 'fullName',
                label: 'Họ tên',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập họ tên' }],
            },
            {
                name: 'role',
                label: 'Role',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn role' }],
                options: [
                    { label: 'Admin', value: 0 },
                    { label: 'Staff', value: 1 },
                ],
            },
            {
                name: 'password',
                label: 'Password',
                type: 'password',
                rules: [
                    { required: true, message: 'Vui lòng nhập password' },
                    { min: 6, message: 'Password tối thiểu 6 ký tự' },
                ],
            },
        ],
        update: [
            {
                name: 'username',
                label: 'Username',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập username' }],
            },
            {
                name: 'fullName',
                label: 'Họ tên',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập họ tên' }],
            },
            {
                name: 'role',
                label: 'Role',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn role' }],
                options: [
                    { label: 'Admin', value: 0 },
                    { label: 'Staff', value: 1 },
                ],
            },
            {
                name: 'password',
                label: 'Password (để trống nếu không đổi)',
                type: 'password',
                rules: [{ min: 0 }],
            },
        ],
        getCreateInitialValues: () => ({
            role: 1,
        }),
        getUpdateInitialValues: (record) => ({
            username: record.username,
            fullName: record.fullName,
            role: record.role,
            password: undefined,
        }),
        mapUpdatePayload: (values, record) => ({
            ...values,
            id: record.id as number,
            password:
                values.password === undefined || values.password === ''
                    ? null
                    : values.password,
        }),
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: true,
    },
}

