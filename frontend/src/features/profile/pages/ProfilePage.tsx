import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Descriptions, Space, Typography, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../auth/store/authStore';
import { ProfileOrdersTable } from '../components/ProfileOrdersTable';
import { API_CONFIG } from '../../../config/api.config';
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint';
import { authApi } from '../../auth/api/authApi';

const { Title } = Typography;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  // Sử dụng getState() để tránh re-render không cần thiết
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Lấy role label
  const roleLabel = useMemo(() => {
    if (!user) return 'N/A';
    if (user.role === API_CONFIG.USER_ROLES.ADMIN) return 'Quản trị viên';
    if (user.role === API_CONFIG.USER_ROLES.STAFF) return 'Nhân viên';
    return 'N/A';
  }, [user]);

  // Handler logout
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      // Gọi API logout
      await authApi.logout();
      // Clear auth store
      useAuthStore.getState().clearAuth();
      // Hiển thị thông báo thành công
      message.success('Đăng xuất thành công');
      // Chuyển về trang login
      navigate({ to: ENDPOINTS.AUTH.LOGIN as any });
    } catch (error) {
      // Ngay cả khi API fail, vẫn clear local state và redirect
      useAuthStore.getState().clearAuth();
      message.warning('Đã đăng xuất khỏi ứng dụng');
      navigate({ to: ENDPOINTS.AUTH.LOGIN as any });
    } finally {
      setLogoutLoading(false);
    }
  };

  // Nếu chưa đăng nhập, hiển thị Alert
  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Bạn chưa đăng nhập"
          description="Vui lòng đăng nhập để xem thông tin hồ sơ cá nhân."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* User Info Card */}
        <Card>
          <Space align="start" size="middle">
            <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Hồ sơ cá nhân
              </Title>
              <Typography.Text type="secondary">
                Thông tin tài khoản của bạn
              </Typography.Text>
            </div>
          </Space>
        </Card>

        {/* User Details */}
        <Card 
          title="Thông tin tài khoản"
          extra={
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={logoutLoading}
            >
              Đăng xuất
            </Button>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên đăng nhập">
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              {user.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {roleLabel}
            </Descriptions.Item>
            <Descriptions.Item label="ID người dùng">
              {user.id}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Orders Table */}
        <Card title="Đơn hàng đã tạo">
          <ProfileOrdersTable userId={user.id} />
        </Card>
      </Space>
    </div>
  );
};

