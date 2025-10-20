import React, { Component, ReactNode } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/layout/Sidebar';
import AppHeader from '../components/layout/Header';
import AppFooter from '../components/layout/Footer';

const { Content, Sider } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

interface MainLayoutState {
  collapsed: boolean;
}

class MainLayout extends Component<MainLayoutProps, MainLayoutState> {
  state: MainLayoutState = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  render() {
    const { children } = this.props;
    const { collapsed } = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} theme="dark">
          <Sidebar collapsed={collapsed} />
        </Sider>
        <Layout>
          <AppHeader />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {children}
            </div>
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    );
  }
}

export default MainLayout;

