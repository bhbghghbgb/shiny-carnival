// src/features/customers/pages/CustomerCreatePage.tsx
import { CustomerModal } from '../components/CustomerModal';
import { useCustomerStore } from '../store/customerStore';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Form } from 'antd';

export const CustomerCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { addCustomer, isModalVisible = true } = useCustomerStore();

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const onOk = () => {
    form.validateFields().then((values) => {
      addCustomer(values);
      navigate({ to: '/customers' });
    });
  };

  const onCancel = () => {
    navigate({ to: '/customers' });
  };

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <CustomerModal
        title="Thêm khách hàng mới"
        open={isModalVisible}
        editing={null}
        form={form}
        onOk={onOk}
        onCancel={onCancel}
      />
    </div>
  );
};