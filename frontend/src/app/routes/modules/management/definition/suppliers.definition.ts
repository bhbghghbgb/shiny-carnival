import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition } from '../../../type/types';
import { SupplierManagementPage } from '../../../../../features/suppliers/pages/SupplierManagementPage';
import { suppliers as mockSuppliers } from '../../../../../_mocks/suppliers';

// 1. Định nghĩa Types và API
// --------------------------

interface SupplierLoaderData {
  suppliers: (typeof mockSuppliers);
  total: number;
}

const supplierSearchSchema = baseSearchSchema.extend({
  // country: z.string().optional(),
  // rating: z.number().min(1).max(5).optional(),
  // isVerified: z.boolean().optional(),
});

export type SupplierSearch = z.infer<typeof supplierSearchSchema>;

async function fetchSuppliers(search: SupplierSearch): Promise<SupplierLoaderData> {
  console.log('Fetching suppliers with filters:', search);
  // Giả lập gọi API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    suppliers: mockSuppliers,
    total: mockSuppliers.length,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const supplierAdminDefinition: ManagementRouteDefinition<
  SupplierLoaderData,     // Kiểu loader data
  SupplierSearch,         // Kiểu search params
  { apiClient: never }      // Kiểu router context (ví dụ)
> = {
  entityName: 'Nhà cung cấp',
  path: '/admin/suppliers',
  component: SupplierManagementPage,
  searchSchema: supplierSearchSchema,
  loader: ({ search }) => fetchSuppliers(search),
};