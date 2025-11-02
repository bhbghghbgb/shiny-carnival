import { z } from 'zod';
import { baseSearchSchema, type CrudModuleDefinition } from '../../../type/types';
import { CustomerListPage } from '../../../../../features/customers/pages/CustomerListPage';
import { CustomerDetailPage } from '../../../../../features/customers/pages/CustomerDetailPage';
import { CustomerCreatePage } from '../../../../../features/customers/pages/CustomerCreatePage';
import { CustomerEditPage } from '../../../../../features/customers/pages/CustomerEditPage';
import { customers as mockCustomers } from '../../../../../_mocks/customers';
import type { CustomerEntity as Customer } from '../../../../../features/customers/types/entity';

// 1. Định nghĩa Types và API
// --------------------------

interface CustomerListData {
  customers: Customer[];
  total: number;
}

const customerSearchSchema = baseSearchSchema.extend({
  // customerType: z.enum(['individual', 'business']).optional(),
  // status: z.enum(['active', 'inactive', 'blocked']).optional(),
  // city: z.string().optional(),
});

export type CustomerListSearch = z.infer<typeof customerSearchSchema>;
export type CustomerDetailParams = { id: string };

async function fetchCustomers(search: CustomerListSearch): Promise<CustomerListData> {
  console.log('Fetching customers with:', search);
  return {
    customers: mockCustomers,
    total: mockCustomers.length
  };
}

async function fetchCustomerById(id: string): Promise<Customer> {
  console.log('Fetching customer with id:', id);
  const customerId = parseInt(id);
  const customer = mockCustomers.find(c => c.id === customerId);
  if (!customer) {
    throw new Error(`Customer with id ${id} not found`);
  }
  return customer;
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------

export const customerModuleDefinition: CrudModuleDefinition<
  CustomerListData,      // Kiểu loader cho List
  Customer,              // Kiểu loader cho Detail
  CustomerListSearch,    // Kiểu search cho List
  CustomerDetailParams,  // Kiểu params cho Detail
  { apiClient: any }      // Kiểu router context
> = {
  entityName: 'Khách hàng',
  basePath: 'customers',
  components: {
    list: CustomerListPage,
    detail: CustomerDetailPage,
    create: CustomerCreatePage,
    edit: CustomerEditPage,
  },
  loaders: {
    list: ({ search }) => fetchCustomers(search),
    detail: ({ params }) => fetchCustomerById(params.id),
  },
  searchSchemas: {
    list: customerSearchSchema,
  },
};

