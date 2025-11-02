import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition } from '../../../type/types';
import { ReportManagementPage } from '../../../../../features/reports/pages/ReportManagementPage';
import { reports as mockReports } from '../../../../../_mocks/reports';

// 1. Định nghĩa Types và API
// --------------------------

interface ReportLoaderData {
  reports: typeof mockReports;
  total: number;
}

const reportSearchSchema = baseSearchSchema.extend({
  reportType: z.enum(['sales', 'inventory', 'customer']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ReportSearch = z.infer<typeof reportSearchSchema>;

async function fetchReports(search: ReportSearch): Promise<ReportLoaderData> {
  console.log('Fetching reports with filters:', search);
  // Giả lập gọi API
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    reports: mockReports,
    total: mockReports.length,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const reportAdminDefinition: ManagementRouteDefinition<
  ReportLoaderData,     // Kiểu loader data
  ReportSearch,         // Kiểu search params
  { apiClient: never }    // Kiểu router context (ví dụ)
> = {
  entityName: 'Báo cáo',
  path: 'reports',
  component: ReportManagementPage,
  searchSchema: reportSearchSchema,
  loader: ({ search }) => fetchReports(search),
};