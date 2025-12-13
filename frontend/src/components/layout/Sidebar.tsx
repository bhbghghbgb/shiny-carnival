import { Menu } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from "@tanstack/react-router";
import { ENDPOINTS } from '../../app/routes/type/routes.endpoint';

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
  return (
    <div>
      <div className="p-4 text-2xl font-bold text-white text-center">Logo</div>
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

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> dev/hung-nt-init-ui
