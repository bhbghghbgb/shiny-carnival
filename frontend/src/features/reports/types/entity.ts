export interface RevenueReportDto {
  summary: {
    overallRevenue: number;
    overallOrders: number;
    overallDiscount: number;
  };
  details: {
    period: string; // '2025-10-26', '2025-W43', '2025-10'
    totalRevenue: number;
    totalOrders: number;
    totalDiscount: number;
  }[];
}
