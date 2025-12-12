export interface RevenueReportParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  groupBy?: 'day' | 'week' | 'month'; // Default: 'day'
}

export interface SalesReportParams {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
  categoryId?: number;
}

export interface TopItemsReportParams {
  startDate: string;
  endDate: string;
  page?: number;
  pageSize?: number;
}
