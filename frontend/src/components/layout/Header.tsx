import React, { Component } from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

class AppHeader extends Component {
  render() {
    return (
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        {/* You can add header content here, like user profile, notifications, etc. */}
      </Header>
    );
  }
}

export default AppHeader;

