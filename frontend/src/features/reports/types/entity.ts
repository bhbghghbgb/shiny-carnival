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

/**
 * TopProductDto - DTO từ backend cho top products report
 */
export interface TopProductDto {
  productId: number;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

/**
 * TopCustomerDto - DTO từ backend cho top customers report
 */
export interface TopCustomerDto {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string; // ISO date string
}
