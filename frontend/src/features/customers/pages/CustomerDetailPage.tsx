import { Card, Descriptions, Button } from 'antd';
import { useLocation, useNavigate } from '@tanstack/react-router';
import type { CustomerEntity } from '../types/entity';
import { useEffect } from 'react';

export const CustomerDetailPage: React.FC = () => {
  const { state } = useLocation();
  const customer = state?.customer as CustomerEntity | undefined;
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      navigate({ to: '/customers' });
    }
  }, [customer, navigate]);

  // Nếu customer chưa có, render loading hoặc null
  if (!customer) {
    return null; // hoặc <Spin />
  }

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Button onClick={() => navigate({ to: '/customers' })} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>
      <Card title="Chi tiết khách hàng">
        <Descriptions column={1}>
          <Descriptions.Item label="Tên">{customer.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
          <Descriptions.Item label="SĐT">{customer.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{customer.address}</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Button onClick={() => navigate({ to: `/customers/${customer.id}/edit`, state: { customer } })}>
            Sửa
          </Button>
        </div>
      </Card>
    </div>
  );
};