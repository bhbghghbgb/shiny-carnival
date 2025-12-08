import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Store Management ©{new Date().getFullYear()} Created by You
    </Footer>
  );
};

export default AppFooter;
