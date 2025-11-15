// src/features/customers/pages/CustomerDetailPage.tsx
import { Card, Descriptions, Button, Spin } from 'antd';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const CustomerDetailPage: React.FC = () => {
  const { state } = useLocation();
  const customer = state?.customer as CustomerEntity | undefined;
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) navigate({ to: '/customers' });
  }, [customer, navigate]);

  if (!customer) return <Spin tip="Đang tải..." />;

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Button onClick={() => navigate({ to: '/customers' })} style={{ marginBottom: 16 }}>
        ← Quay lại
      </Button>
      <Card title={`KH: ${customer.name}`}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
          <Descriptions.Item label="SĐT">{customer.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{customer.address}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {customer.createdAt ? new Date(customer.createdAt).toLocaleString('vi-VN') : '—'}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => navigate({ to: `/customers/${customer.id}/edit`, state: { customer } })}>
            Sửa khách hàng
          </Button>
        </div>
      </Card>
    </div>
  );
};