
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Link} from '@tanstack/react-router';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <PieChartOutlined />, label: <Link to="/">Dashboard</Link>},
  { key: '2', icon: <DesktopOutlined />, label: <Link to="/products">Products</Link> },
  { key: '3', icon: <ContainerOutlined />, label: <Link to="/orders">Orders</Link> },
  {
    key: 'sub1',
    label: 'Management',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: <Link to="/management/customers">Customers</Link>},
      { key: '6', label: <Link to="/management/suppliers">Suppliers</Link> },
      { key: '7', label: <Link to="/management/categories">Categories</Link> },
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

export default Sidebar;

