// frontend/src/features/users/pages/UserManagementPage.tsx
import { withGenericManagement } from '../../../components/hoc/GenericManagementPage';
import type { UserEntity } from '../types/entity';
import type { GenericPageConfig } from '../../../types/generic-page';
import { Space, Avatar, Typography, Tag } from 'antd';
import { UserOutlined, CrownOutlined, TeamOutlined } from '@ant-design/icons';
import { useGenericManagement } from '../../../hooks/useGenericManagement';
import { userApi } from '../api/userApi';

const { Text } = Typography;

// Cấu hình chi tiết cho trang quản lý người dùng.
const userPageConfig: GenericPageConfig<UserEntity> = {
    title: 'Quản lý Người dùng',
    entityName: 'user',
    apiEndpoints: {
        list: '/api/admin/users',
        create: '/api/admin/users',
        update: '/api/admin/users/{id}',
        delete: '/api/admin/users/{id}',
    },
    columns: [
        // Cấu hình cột cho bảng người dùng
        {
            title: 'Người dùng',
            key: 'user',
            render: (record: UserEntity) => (
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
        // ... các cột khác
    ],
    formFields: [
        // Cấu hình trường form cho người dùng
        {
            name: 'username',
            label: 'Tên đăng nhập',
            rules: [{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }],
            component: 'Input',
        },
        {
            name: 'fullName',
            label: 'Họ và tên',
            rules: [{ required: true, message: 'Vui lòng nhập họ và tên!' }],
            component: 'Input',
        },
        {
            name: 'email',
            label: 'Email',
            rules: [
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
            ],
            component: 'Input',
        },
        {
            name: 'role',
            label: 'Vai trò',
            rules: [{ required: true, message: 'Vui lòng chọn vai trò!' }],
            component: 'Select',
            componentProps: {
                options: [
                    { label: 'Admin', value: 0 },
                    { label: 'Staff', value: 1 },
                ],
            },
        },
        {
            name: 'password',
            label: 'Mật khẩu',
            rules: [
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ],
            component: 'Input.Password',
            hidden: (record: UserEntity) => !!record.id, // Ẩn khi edit
        },
    ],
    statisticsConfig: {
        enabled: true,
        statisticsItems: [
            { title: "Tổng người dùng", value: 0, icon: <TeamOutlined /> },
            { title: "Quản trị viên", value: 0, icon: <CrownOutlined /> },
            { title: "Nhân viên", value: 0, icon: <UserOutlined /> }
        ]
    },
    searchConfig: {
        enabled: true,
        placeholder: "Tìm theo tên hoặc username..."
    }
};

// Tạo và export component trang quản lý người dùng.
// HOC này cần được gọi với đầy đủ tham số: config, route, apiService, và hook
export const UserManagementPage = ({ loaderData, route }: { loaderData: any; route: any }) => {
    return withGenericManagement(
        userPageConfig,
        route,
        userApi,
        useGenericManagement
    )({ loaderData });
};
