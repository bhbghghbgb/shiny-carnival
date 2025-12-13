import { LogoutOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@tanstack/react-router';
import { Avatar, Dropdown, Layout, Menu, Space } from 'antd';
import { useLogout } from '../../features/auth/hooks/useLogout';

const { Header } = Layout;

const AppHeader = () => {

  const navigate = useNavigate();
  const { logout } = useLogout();


  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />} onClick={() => navigate({ to: "/auth/profile" })}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={logout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: '#fff', padding: '0 16px' }}>
      {/* You can add header content here, like user profile, notifications, etc. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>Quản trị hệ thống</div>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            </Space>
          </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;

