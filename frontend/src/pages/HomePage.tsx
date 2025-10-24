import React from 'react';
import ProductList from '../features/products/pages/ProductList';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  return (
    <main style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Title level={4}>Welcome back, Admin!</Title>
        <Text type="secondary">This is where the main content will go.</Text>
      </div>

      <ProductList />
    </main>
  );
};

export default HomePage;
