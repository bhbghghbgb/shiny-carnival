// src/features/customers/pages/CustomerListPage.tsx
import { CustomerHeader } from '../components/CustomerHeader';
import { CustomerSearch } from '../components/CustomerSearch';
import { CustomerTable } from '../components/CustomerTable';
import { useCustomerStore } from '../store/customerStore';
import { useNavigate } from '@tanstack/react-router';

export const CustomerListPage: React.FC = () => {
  const {
    filteredCustomers,
    totalCustomers,
    searchText,
    sortField,
    sortOrder,
    setSearchText,
    setSort,
    deleteCustomer,
    refresh,
  } = useCustomerStore();

  const navigate = useNavigate();

  const handleSearch = (value: string) => setSearchText(value);
  const handleSort = (field: string, order: 'ascend' | 'descend') => setSort(field as any, order);
  const handleDelete = (customer: any) => deleteCustomer(customer.id);

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100%' }}>
      <CustomerHeader
        total={totalCustomers}
        onAdd={() => navigate({ to: '/customers/create' })}
        onRefresh={refresh}
      />
      <CustomerSearch value={searchText} onSearch={handleSearch} />
      <CustomerTable
        data={filteredCustomers}
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