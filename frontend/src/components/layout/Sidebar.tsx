import { useMemo } from 'react';
import { Avatar, Menu, Typography } from 'antd'
import {
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from "@tanstack/react-router";
import { ENDPOINTS } from '../../app/routes/type/routes.endpoint';
import { useAuthStore } from '../../features/auth/store/authStore';
import { canAccessMenuItem } from './menuConfig';

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = [
  { key: '2', icon: <ShoppingCartOutlined />, label: <Link to={ENDPOINTS.STAFF.ORDER as any}>Order</Link> }, 
  // { key: '3', icon: <QrcodeOutlined />, label: <Link to={ENDPOINTS.STAFF.QR_SCANNER as any}>QR Scanner</Link> },
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
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const isStaff = useAuthStore((state) => state.isStaff());

  // Filter menu items dựa trên role
  const filteredItems = useMemo(() => {
    if (!isAuthenticated) {
      return [];
    }

    return items
      .map((item): MenuItem | null => {
        // Type guard: đảm bảo item là object
        if (!item || typeof item !== 'object') {
          return null;
        }

        // Nếu là menu item có children (submenu)
        if ('children' in item && item.children && Array.isArray(item.children)) {
          // Filter children items dựa trên role
          const filteredChildren = item.children.filter((child): child is MenuItem => {
            if (child && typeof child === 'object' && 'key' in child && child.key) {
              return canAccessMenuItem(String(child.key), isAdmin, isStaff);
            }
            return false;
          });

          // Chỉ hiển thị submenu nếu có ít nhất 1 child item được phép
          if (filteredChildren.length === 0) {
            return null;
          }

          return {
            ...item,
            children: filteredChildren,
          } as MenuItem;
        }

        // Nếu là menu item đơn lẻ
        if ('key' in item && item.key) {
          const hasAccess = canAccessMenuItem(String(item.key), isAdmin, isStaff);
          return hasAccess ? item : null;
        }

        return item;
      })
      .filter((item): item is MenuItem => item !== null);
  }, [isAuthenticated, isAdmin, isStaff]);

  return (
    <div>
      <div className="p-4 text-2xl font-bold text-white text-center">
        Logo
      </div>
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
          <Link to={ENDPOINTS.AUTH.PROFILE as any}>Hồ sơ</Link>
        </div>
      )}
      <Menu
        // defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={filteredItems}
      />
    </div>
  )
}

export default Sidebar
