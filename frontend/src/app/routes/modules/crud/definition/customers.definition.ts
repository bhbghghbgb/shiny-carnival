import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type CrudModuleDefinition, type LoaderContext } from '../../../type/types';
import { CustomerListPage } from '../../../../../features/customers/pages/CustomerListPage';
import { CustomerDetailPage } from '../../../../../features/customers/pages/CustomerDetailPage';
import { CustomerCreatePage } from '../../../../../features/customers/pages/CustomerCreatePage';
import { CustomerEditPage } from '../../../../../features/customers/pages/CustomerEditPage';
import { customers as mockCustomers } from '../../../../../_mocks/customers';
import type { CustomerEntity as Customer } from '../../../../../features/customers/types/entity';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

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

async function fetchCustomers(ctx: LoaderContext<Record<string, never>, CustomerListSearch, { queryClient: QueryClient }>): Promise<CustomerListData> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('customers');
  const queryOpts = queryOptions<CustomerListData>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => ({
      customers: mockCustomers,
      total: mockCustomers.length,
    }),
  });
  return context.queryClient.ensureQueryData(queryOpts);
}

async function fetchCustomerById(ctx: LoaderContext<CustomerDetailParams, CustomerListSearch, { queryClient: QueryClient }>): Promise<Customer> {
  const { params, context } = ctx;
  const queryKeys = createQueryKeys('customers');
  const queryOpts = queryOptions<Customer>({
    queryKey: [...queryKeys.details(), params.id],
    queryFn: async () => {
      const customerId = parseInt(params.id);
      const customer = mockCustomers.find(c => c.id === customerId);
      if (!customer) throw new Error(`Customer with id ${params.id} not found`);
      return customer;
    },
  });
  return context.queryClient.ensureQueryData(queryOpts);
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------

export const customerModuleDefinition: CrudModuleDefinition<
  CustomerListData,      // Kiểu loader cho List
  Customer,              // Kiểu loader cho Detail
  CustomerListSearch,    // Kiểu search cho List
  CustomerDetailParams,  // Kiểu params cho Detail
  { queryClient: QueryClient }      // Kiểu router context
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
    list: (ctx) => fetchCustomers(ctx),
    detail: (ctx) => fetchCustomerById(ctx),
  },
  searchSchemas: {
    list: customerSearchSchema,
  },
};

