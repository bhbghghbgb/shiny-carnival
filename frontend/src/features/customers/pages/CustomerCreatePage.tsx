import { CustomerModal } from '../components/CustomerModal';
import { useCustomerForm } from '../hook/useCustomerForm';
import { useNavigate } from '@tanstack/react-router';
import { message } from 'antd';


export const CustomerCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    message.success('Thêm khách hàng thành công!');
    navigate({ to: '/customers' });
  };

  const { form, onSubmit } = useCustomerForm({
    editingCustomer: null,
    onSuccess: handleSuccess,
  });

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <CustomerModal
        open={true}
        editing={null}
        form={form}
        onOk={onSubmit}
        onCancel={() => navigate({ to: '/customers' })}
      />
    </div>
  );
};