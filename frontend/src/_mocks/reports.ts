export const reports = [
  {
    id: 'rep_1',
    title: 'Báo cáo doanh số tháng 1',
    type: 'sales' as const,
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    generatedAt: '2024-02-01',
    status: 'completed' as const,
    downloadUrl: '/api/reports/download/rep_1',
  },
  {
    id: 'rep_2',
    title: 'Báo cáo tồn kho',
    type: 'inventory' as const,
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
    generatedAt: '2024-02-01',
    status: 'completed' as const,
    downloadUrl: '/api/reports/download/rep_2',
  },
];

