import { z } from 'zod';
import { queryOptions, type QueryClient } from '@tanstack/react-query';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { ReportManagementPage } from '../../../../../features/reports/pages/ReportManagementPage';
import { reports as mockReports } from '../../../../../_mocks/reports';
import { createQueryKeys } from '../../../../../lib/query/queryOptionsFactory';

// 1. Định nghĩa Types và API
// --------------------------

const reportSearchSchema = baseSearchSchema.extend({
  reportType: z.enum(['sales', 'inventory', 'customer']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ReportSearch = z.infer<typeof reportSearchSchema>;

async function fetchReports(ctx: LoaderContext<Record<string, never>, ReportSearch, { queryClient: QueryClient }>): Promise<{ reports: typeof mockReports; total: number }> {
  const { search, context } = ctx;
  const queryKeys = createQueryKeys('reports');
  const queryOpts = queryOptions<{ reports: typeof mockReports; total: number }>({
    queryKey: [...queryKeys.lists(), 'mock', search],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        reports: mockReports,
        total: mockReports.length,
      };
    },
  });

  return context.queryClient.ensureQueryData(queryOpts);
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const reportAdminDefinition: ManagementRouteDefinition<
  { reports: typeof mockReports; total: number },     // Kiểu loader data
  ReportSearch,         // Kiểu search params
  { queryClient: QueryClient }    // Kiểu router context
> = {
  entityName: 'Báo cáo',
  path: 'reports',
  component: ReportManagementPage,
  searchSchema: reportSearchSchema,
  loader: (ctx) => fetchReports(ctx),
};