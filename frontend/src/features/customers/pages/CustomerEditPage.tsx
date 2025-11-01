import { CustomerModal } from '../components/CustomerModal';
import { useCustomerForm } from '../hook/useCustomerForm';
import { useLocation, useNavigate } from '@tanstack/react-router';
import type { CustomerEntity } from '../types/entity';
import { message } from 'antd';

export const CustomerEditPage: React.FC = () => {
  const { state } = useLocation();
  const customer = state?.customer as CustomerEntity | undefined;
  const navigate = useNavigate();

  if (!customer) {
    navigate({ to: '/customers' });
    return null;
  }

  const handleSuccess = () => {
    message.success('Cập nhật khách hàng thành công!');
    navigate({ to: '/customers' });
  };

  const { form, onSubmit } = useCustomerForm({
    editingCustomer: customer || null,
    onSuccess: handleSuccess,
  });

  const handleCancel = () => {
    form.resetFields();
    navigate({ to: '/customers' });
  };

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <CustomerModal
        open={true}
        editing={customer}
        form={form}
        onOk={onSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};