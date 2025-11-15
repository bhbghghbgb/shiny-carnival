// src/features/customers/pages/CustomerEditPage.tsx
import { CustomerModal } from '../components/CustomerModal';
import { useCustomerStore } from '../store/customerStore';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import type { CustomerEntity } from '../types/entity';

export const CustomerEditPage: React.FC = () => {
  const [form] = Form.useForm();
  const { state } = useLocation();
  const customer = state?.customer as CustomerEntity | undefined;
  const navigate = useNavigate();
  const { updateCustomer } = useCustomerStore();

  useEffect(() => {
    if (!customer) {
      message.error('Không tìm thấy khách hàng!');
      navigate({ to: '/customers' });
    } else {
      form.setFieldsValue(customer);
    }
  }, [customer, form, navigate]);

  const onOk = () => {
    form.validateFields().then((values) => {
      if (customer) {
        updateCustomer(customer.id, values);
        message.success('Cập nhật thành công!');
        navigate({ to: '/customers' });
      }
    });
  };

  const onCancel = () => {
    navigate({ to: '/customers' });
  };

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <CustomerModal
        open={!!customer}
        editing={customer || null}
        form={form}
        onOk={onOk}
        onCancel={onCancel}
      />
    </div>
  );
};