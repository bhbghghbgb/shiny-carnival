import { Menu } from 'antd'
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
  QrcodeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from "@tanstack/react-router";
import { ENDPOINTS } from '../../app/routes/type/routes.endpoint';

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  { key: '1', icon: <UserOutlined />, label: <Link to={ENDPOINTS.AUTH.PROFILE as any}>Hồ sơ</Link> },
  { key: '2', icon: <ShoppingCartOutlined />, label: <Link to={ENDPOINTS.STAFF.ORDER as any}>Order</Link> }, 
    { key: '3', icon: <QrcodeOutlined />, label: <Link to={ENDPOINTS.ADMIN.QR_SCANNER as any}>QR Scanner</Link> },
  {
    key: 'sub1',
    label: 'Management',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: <Link to={ENDPOINTS.ADMIN.USERS as any}>Users</Link> },
      { key: '5a', label: <Link to={ENDPOINTS.ADMIN.PRODUCTS as any}>Products</Link> },
      { key: '6', label: <Link to={ENDPOINTS.ADMIN.SUPPLIERS as any}>Suppliers</Link> },
      { key: '7', label: <Link to={ENDPOINTS.ADMIN.CATEGORIES as any}>Categories</Link> },
      { key: '8', label: <Link to={ENDPOINTS.ADMIN.CUSTOMERS.LIST as any}>Customers</Link> },
      { key: '9', label: <Link to={ENDPOINTS.ADMIN.ORDERS.LIST as any}>Orders</Link> },
      { key: '10', label: <Link to={ENDPOINTS.ADMIN.INVENTORY.LIST as any}>Inventory</Link> },
      { key: '11', label: <Link to={ENDPOINTS.ADMIN.PROMOTIONS as any}>Promotions</Link> },
      { key: '12', label: <Link to={ENDPOINTS.ADMIN.REPORTS as any}>Reports</Link> },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  return (
    <div>
      <div className="p-4 text-2xl font-bold text-white text-center">
        Logo
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  )
}

export default Sidebar
