import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import type { CustomerEntity } from '../types/entity';
import { useNavigate } from '@tanstack/react-router';

interface Props {
  editingCustomer?: CustomerEntity | null;
  onSuccess: (customer: CustomerEntity) => void;
}

export const useCustomerForm = ({ editingCustomer, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset form khi mở
  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue(editingCustomer);
    } else {
      form.resetFields();
    }
  }, [editingCustomer, form]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      let customer: CustomerEntity;
      if (editingCustomer) {
        customer = { ...editingCustomer, ...values };
      } else {
        customer = {
          id: Date.now(), // mock ID
          ...values,
          createdAt: new Date().toISOString(),
        };
      }

      onSuccess(customer);
      message.success(editingCustomer ? 'Cập nhật thành công!' : 'Thêm thành công!');
      form.resetFields();
      navigate({ to: '/customers' });
    } catch (error) {
      console.log('Validate Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, onSubmit };
};