// src/pages/ProfilePage.tsx
import React from "react";
import {
  Card,
  Avatar,
  Spin,
  Typography,
  Descriptions,
  Space,
  Button,
  Divider,
  Tag,
  message,
} from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  CrownOutlined,
  LeftOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useLogout";

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, loading: logoutLoading } = useLogout();

  // Atomic selectors
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect nếu chưa login
  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      message.info("Vui lòng đăng nhập để xem thông tin cá nhân");
      navigate({ to: "/auth/login" });
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoBack = () => {
    window.history.back();
  };

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 200 }}>
        <Spin size="large" />
      </div>
    );
  }

  const roleColor = user.role === 0 ? "#f5222d" : "#52c41a";
  const roleText = user.role === 0 ? "Administrator" : "Staff";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header cá nhân với background gradient */}
          <div
            style={{
              background: "linear-gradient(120deg, #1890ff, #096dd9)",
              padding: "40px 32px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#fff",
                color: "#1890ff",
                border: "4px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />
            <Title level={2} style={{ color: "#fff", margin: "20px 0 8px" }}>
              {user.fullName}
            </Title>
            <Text style={{ color: "#e6f7ff", fontSize: 16 }}>
              {user.username}
            </Text>
            <div style={{ marginTop: 12 }}>
              <Tag
                icon={<CrownOutlined />}
                color={user.role === 0 ? "red" : "green"}
                style={{ fontSize: 14, padding: "4px 12px" }}
              >
                {roleText}
              </Tag>
            </div>
          </div>

          {/* Nội dung chi tiết */}
          <div style={{ padding: "32px" }}>
            <Title level={4} style={{ marginBottom: 24 }}>
              <IdcardOutlined style={{ marginRight: 8 }} />
              Thông tin chi tiết
            </Title>

            <Descriptions bordered column={1} labelStyle={{ fontWeight: "bold" }}>
              <Descriptions.Item label="ID">
                <Text strong>{user.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tên đăng nhập">
                <Text copyable>{user.username}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                <Text strong>{user.fullName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color={roleColor} style={{ fontSize: 14 }}>
                  {roleText}
                </Tag>
              </Descriptions.Item>
              {/* Nếu có thêm data như email, ngày tạo thì thêm ở đây */}
              {/* <Descriptions.Item label="Email">
                <Text type="secondary">
                  <MailOutlined style={{ marginRight: 6 }} />
                  {user.email || "Chưa cập nhật"}
                </Text>
              </Descriptions.Item> */}
            </Descriptions>

            <Divider />

            {/* Nút hành động */}
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              size="large"
            >
              <Button
                type="default"
                size="large"
                icon={<LeftOutlined />}
                onClick={handleGoBack}
                style={{ minWidth: 120 }}
              >
                Trở về
              </Button>

              <Button
                type="primary"
                danger
                size="large"
                icon={<LogoutOutlined />}
                onClick={logout}
                loading={logoutLoading}
                style={{ minWidth: 120 }}
              >
                Đăng xuất
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};