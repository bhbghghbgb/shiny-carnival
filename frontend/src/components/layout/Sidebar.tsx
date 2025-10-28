
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {Link} from "@tanstack/react-router";

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
      { key: '5', label: <Link to={"/users"}>Users</Link> },
      { key: '6', label: 'Suppliers' },
      { key: '7', label: 'Categories' },
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