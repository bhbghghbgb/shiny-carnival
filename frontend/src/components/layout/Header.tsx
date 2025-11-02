import { LogoutOutlined, SearchOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, Dropdown, Input, Layout, Menu, message, type MenuProps } from "antd";

const { Header } = Layout;
const { Search } = Input;

const AppHeader = () => {
  const navigate = useNavigate();

  // ✅ Khai báo kiểu cho sự kiện click của menu
  const handleMenuClick: MenuProps["onClick"] = (info) => {
    const { key } = info;

    if (key === "3") {
      // Xử lý đăng xuất
      localStorage.removeItem("token");
      message.success("Đăng xuất thành công!");
      navigate({to : "/auth/login"});
    }
  };
  
  const menu = (
    <Menu
    onClick={handleMenuClick}
      items={[
        {
          key: "1",
          label: "Thông tin cá nhân",
          icon: <UserOutlined />,
        },
        {
          key: "2",
          label: "Cài đặt",
          icon: <SettingOutlined />,
        },
        {
          type: "divider",
        },
        {
          key: "3",
          label: "Đăng xuất",
          icon: <LogoutOutlined />,
          danger: true,
        },
      ]}
    />
  );

  return (
    <Header
      style={{ background: "#fff", padding: "0 16px" }}
      className="flex items-center justify-between shadow-sm"
    >
      {/* Logo hoặc tên app */}
      <div className="text-xl font-semibold text-gray-700">My Dashboard</div>

      {/* Thanh tìm kiếm */}
      <div className="flex items-center w-180">
        <Search
          placeholder="Tìm kiếm..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={(value) => console.log("Tìm:", value)}
          className="w-full"
        />
      </div>

      {/* Dropdown hồ sơ người dùng */}
      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition">
        <Avatar size="large" icon={<UserOutlined />} />
          <span className="text-gray-700 font-medium hidden sm:inline">
            Nguyen Thanh Hung
          </span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;