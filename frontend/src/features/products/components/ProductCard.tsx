import React from 'react';
import { Card, Typography } from 'antd';
import type {ProductEntity} from "../product.ts";

const { Title, Text } = Typography;


const ProductCard: React.FC<{ product: ProductEntity }> = ({ product }) => {
  return (
    <Card
      hoverable
      bordered
      style={{ borderRadius: 12 }}
      cover={
        <div
          style={{
            height: 150,
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#999',
          }}
        >
          🛒
        </div>
      }
    >
      <Title level={5} style={{ marginBottom: 4 }}>
        {product.productName}
      </Title>
      <Text type="secondary" style={{ display: 'block' }}>
        Mã vạch: {product.barcode}
      </Text>
      <Text type="secondary" style={{ display: 'block' }}>
        Đơn vị: {product.unit}
      </Text>
      <Title level={4} style={{ color: '#1677ff', marginTop: 8 }}>
        {product.price.toLocaleString('vi-VN')} ₫
      </Title>
    </Card>
  );
};

export default ProductCard;
