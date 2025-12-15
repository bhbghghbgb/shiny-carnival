export interface RevenueReportParams {
  startDate: string; // ISO 8601 date-time string (UTC) - format: "2024-01-01T00:00:00.000Z"
  endDate: string; // ISO 8601 date-time string (UTC) - format: "2024-01-31T23:59:59.999Z"
  groupBy?: 'day' | 'week' | 'month'; // Default: 'day'
}

export interface SalesReportParams {
  startDate: string; // ISO 8601 date-time string (UTC)
  endDate: string; // ISO 8601 date-time string (UTC)
  groupBy?: 'day' | 'week' | 'month';
  categoryId?: number;
}

export interface TopItemsReportParams {
  startDate: string; // ISO 8601 date-time string (UTC)
  endDate: string; // ISO 8601 date-time string (UTC)
  page?: number;
  pageSize?: number;
}
