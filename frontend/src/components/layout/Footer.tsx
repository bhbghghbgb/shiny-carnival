import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Store Management ©{new Date().getFullYear()} Created By Nguyen Thanh Hung
    </Footer>
  );
};

export default AppFooter;
