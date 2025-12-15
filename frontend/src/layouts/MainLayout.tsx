
import { Layout } from 'antd';
import { useRef, useState, type ReactNode } from 'react';
import AppFooter from '../components/layout/Footer';
import AppHeader from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

const { Content, Sider } = Layout;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(true); // Mặc định collapsed
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Clear timeout nếu có
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Mở sidebar khi hover
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    // Clear timeout nếu có
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Thêm delay nhỏ để tránh flickering khi di chuyển chuột nhanh
    hoverTimeoutRef.current = setTimeout(() => {
      setCollapsed(true);
    }, 100);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Sidebar collapsed={collapsed} />
      </Sider>
      <Layout>
        <AppHeader />
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{  background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;

