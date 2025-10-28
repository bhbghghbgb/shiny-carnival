
import { useState, ReactNode } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/layout/Sidebar';
import AppHeader from '../components/layout/Header';
import AppFooter from '../components/layout/Footer';

const { Content, Sider } = Layout;

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="dark">
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

