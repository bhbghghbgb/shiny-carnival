import React from 'react';
import { Row, Col, Typography } from 'antd';
import ProductCard from '../components/ProductCard';
import type { ProductEntity } from '../types/entity';
import { useProducts } from '../hooks';

const { Title } = Typography;

const ProductList: React.FC = () => {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <section style={{ marginTop: 24 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Danh sách sản phẩm
        </Title>
        <div>Đang tải...</div>
      </section>
    );
  }

  return (
    <section style={{ marginTop: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Danh sách sản phẩm
      </Title>

      <Row gutter={[16, 16]}>
        {products?.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default ProductList;
