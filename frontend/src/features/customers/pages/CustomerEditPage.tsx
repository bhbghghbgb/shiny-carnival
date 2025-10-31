import { CustomerModal } from '../components/CustomerModal';
import { useCustomerForm } from '../hook/useCustomerForm';
import { useLocation, useNavigate } from '@tanstack/react-router';
import type { CustomerEntity } from '../types/entity';

export const CustomerEditPage: React.FC = () => {
  const { state } = useLocation();
  const customer = state?.customer as CustomerEntity | undefined;
  const navigate = useNavigate();

  const { form, onSubmit } = useCustomerForm({
    editingCustomer: customer || null,
    onSuccess: () => {},
  });

  if (!customer) {
    navigate({ to: '/customers' });
    return null;
  }

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <CustomerModal
        open={true}
        editing={customer}
        form={form}
        onOk={onSubmit}
        onCancel={() => navigate({ to: '/customers' })}
      />
    </div>
  );
};