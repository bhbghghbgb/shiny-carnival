export interface RevenueReportParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  groupBy?: 'day' | 'week' | 'month'; // Default: 'day'
}
