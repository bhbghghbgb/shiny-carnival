import React from 'react';
import { Row, Col, Typography } from 'antd';
import ProductCard from './ProductCard';
import { products } from '../../_mocks/products';

const { Title } = Typography;

const ProductList: React.FC = () => {
  return (
    <section style={{ marginTop: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Danh sách sản phẩm
      </Title>

      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default ProductList;
