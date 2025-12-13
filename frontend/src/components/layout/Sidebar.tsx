import { Avatar, Menu, Typography } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from "@tanstack/react-router";
import { ENDPOINTS } from '../../app/routes/type/routes.endpoint';
import { useAuthStore } from '../../features/auth/store';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: <Link to={"/"}>Dashboard</Link>},
  { key: '2', icon: <DesktopOutlined />, label: <Link to={"/admin/products"}>Products</Link> },
  { key: '3', icon: <ContainerOutlined />, label: <Link to={"/Orders"}>Orders</Link> },
  {
    key: 'sub1',
    label: 'Management',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: <Link to={ENDPOINTS.ADMIN.USERS}>Users</Link> },
      { key: '5a', label: <Link to={ENDPOINTS.ADMIN.PRODUCTS}>Products</Link> },
      { key: '6', label: <Link to={ENDPOINTS.ADMIN.SUPPLIERS}>Suppliers</Link> },
      { key: '7', label: <Link to={ENDPOINTS.ADMIN.CATEGORIES}>Categories</Link> },
      { key: '8', label: <Link to={ENDPOINTS.ADMIN.CUSTOMERS.LIST}>Customers</Link> },
      { key: '9', label: <Link to={ENDPOINTS.ADMIN.ORDERS.LIST}>Orders</Link> },
      { key: '10', label: <Link to={ENDPOINTS.ADMIN.INVENTORY.LIST}>Inventory</Link> },
      { key: '11', label: <Link to={ENDPOINTS.ADMIN.PROMOTIONS}>Promotions</Link> },
      { key: '12', label: <Link to={ENDPOINTS.ADMIN.REPORTS}>Reports</Link> },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div>
      <div className="p-4 text-2xl font-bold text-white text-center">Logo</div>
      {isAuthenticated && !collapsed && (
        <div className="px-4 py-3 mb-4 bg-gray-800 rounded-md mx-2 text-white flex items-center space-x-3">
          <Avatar 
            size="large"
            style={{ backgroundColor: '#1890ff', color: '#fff', fontWeight: 'bold' }}
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : "O"}
          </Avatar>
          <Typography.Text ellipsis style={{ color: 'white', fontWeight: '500', marginLeft: "10px" }}>
            {user?.username || "No Name"}
          </Typography.Text>
        </div>
      )}
      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default Sidebar;
