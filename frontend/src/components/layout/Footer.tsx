import React, { Component } from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class AppFooter extends Component {
  render() {
    return (
      <Footer style={{ textAlign: 'center' }}>
        Store Management ©{new Date().getFullYear()} Created by You
      </Footer>
    );
  }
}

export default AppFooter;
