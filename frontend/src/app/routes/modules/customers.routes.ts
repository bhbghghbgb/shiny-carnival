import { z } from 'zod';
import { type ModuleRoutes, baseSearchSchema } from '../type/types';
import { createCRUDRoutes } from '../utils/routeHelpers';
import { CustomerListPage } from '../../../features/customers/pages/CustomerListPage';
import { CustomerDetailPage } from '../../../features/customers/pages/CustomerDetailPage';
import { CustomerCreatePage } from '../../../features/customers/pages/CustomerCreatePage';
import { CustomerEditPage } from '../../../features/customers/pages/CustomerEditPage';

// Extended search schema cho customers
const customerSearchSchema = baseSearchSchema.extend({
  customerType: z.enum(['individual', 'business']).optional(),
  status: z.enum(['active', 'inactive', 'blocked']).optional(),
  city: z.string().optional(),
  registrationDateFrom: z.string().optional(),
  registrationDateTo: z.string().optional(),
});

export type CustomerSearch = z.infer<typeof customerSearchSchema>;

// Customers module routes configuration
export const customersRoutes: ModuleRoutes = {
  moduleName: 'customers',
  basePath: '/customers',
  routes: createCRUDRoutes(
    'khách hàng',
    '/customers',
    {
      list: CustomerListPage,
      detail: CustomerDetailPage,
      create: CustomerCreatePage,
      edit: CustomerEditPage,
    },
    {
      searchSchema: customerSearchSchema,
      requiresAuth: true,
    }
  ),
};
