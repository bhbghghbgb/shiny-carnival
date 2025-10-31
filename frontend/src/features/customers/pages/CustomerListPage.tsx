// src/features/customers/pages/CustomerListPage.tsx
import { CustomerHeader } from '../components/CustomerHeader';
import { CustomerSearch } from '../components/CustomerSearch';
import { CustomerTable } from '../components/CustomerTable';
import { useCustomerList } from '../hook/useCustomerList';
import { useNavigate } from '@tanstack/react-router';

export const CustomerListPage: React.FC = () => {
  const {
    customers,
    totalCustomers,
    searchText,
    sortField,
    sortOrder,
    handleSearch,
    handleSort,
    clearFilters,
    handleDelete,
    refresh,
    setCustomers,
  } = useCustomerList();

  const navigate = useNavigate();

  const handleSuccess = (customer: any) => {
    if (customer.id && customers.some(c => c.id === customer.id)) {
      setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
    } else {
      setCustomers(prev => [...prev, customer]);
    }
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100%' }}>
      <CustomerHeader
        total={totalCustomers}
        onAdd={() => navigate({ to: '/customers/create' })}
        onRefresh={refresh}
      />
      <CustomerSearch value={searchText} onSearch={handleSearch} />
      <CustomerTable
        data={customers}
        total={totalCustomers}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEdit={(record) => navigate({ to: `/customers/${record.id}/edit`, state: { customer: record } })}
        onDelete={handleDelete}
        onView={(record) => navigate({ to: `/customers/${record.id}`, state: { customer: record } })}
      />
    </div>
  );
};