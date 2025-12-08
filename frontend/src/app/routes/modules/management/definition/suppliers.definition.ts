import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { SupplierManagementPage } from '../../../../../features/suppliers/pages/SupplierManagementPage';
import { suppliers as mockSuppliers } from '../../../../../_mocks/suppliers';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API
// --------------------------

const supplierSearchSchema = baseSearchSchema.extend({
  // country: z.string().optional(),
  // rating: z.number().min(1).max(5).optional(),
  // isVerified: z.boolean().optional(),
});

export type SupplierSearch = z.infer<typeof supplierSearchSchema>;

async function fetchSuppliers(ctx: LoaderContext<Record<string, never>, SupplierSearch, { queryClient: QueryClient }>): Promise<{ suppliers: typeof mockSuppliers; total: number }> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('suppliers');
  const queryOpts = queryOptions<{ suppliers: typeof mockSuppliers; total: number }>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        suppliers: mockSuppliers,
        total: mockSuppliers.length,
      };
    },
  });

  return context.queryClient.ensureQueryData(queryOpts);
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const supplierAdminDefinition: ManagementRouteDefinition<
  { suppliers: typeof mockSuppliers; total: number },     // Kiểu loader data
  SupplierSearch,         // Kiểu search params
  { queryClient: QueryClient }      // Kiểu router context
> = {
  entityName: 'Nhà cung cấp',
  path: 'suppliers',
  component: SupplierManagementPage,
  searchSchema: supplierSearchSchema,
  loader: (ctx) => fetchSuppliers(ctx),
};