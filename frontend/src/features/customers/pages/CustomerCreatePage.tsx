import { CustomerModal } from '../components/CustomerModal';
import { useCustomerForm } from '../hook/useCustomerForm';
import { useNavigate } from '@tanstack/react-router';

export const CustomerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { form, onSubmit } = useCustomerForm({
    editingCustomer: null,
    onSuccess: () => {}, // Không cần ở đây vì navigate
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