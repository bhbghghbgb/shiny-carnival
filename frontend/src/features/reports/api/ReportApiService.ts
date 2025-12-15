import { BaseApiService } from '../../../lib/api/base';
import axiosClient from '../../../lib/api/axios';
import { API_CONFIG } from '../../../config/api.config';
import type { RevenueReportDto } from '../types/entity';
import type { RevenueReportParams, SalesReportParams, TopItemsReportParams } from '../types/api';
import type { PagedList } from '../../../lib/api/types/api.types';

/**
 * ReportApiService - Service cho các API báo cáo
 * 
 * Sử dụng BaseApiService.custom() để gọi các endpoint đặc biệt
 * vì các endpoint report không tuân theo pattern CRUD chuẩn
 */
export class ReportApiService extends BaseApiService {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.REVENUE_REPORT,
      axiosInstance: axiosClient,
    });
  }

  /**
   * GET /api/admin/reports/revenue
   * Lấy báo cáo doanh thu
   * 
   * @param params - RevenueReportParams (startDate, endDate, groupBy)
   * @returns Promise<RevenueReportDto>
   */
  async getRevenueReport(params: RevenueReportParams): Promise<RevenueReportDto> {
    return this.custom<RevenueReportDto>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.REVENUE_REPORT,
      undefined,
      params
    );
  }

  /**
   * GET /api/admin/reports/sales
   * Lấy báo cáo bán hàng
   * 
   * @param params - SalesReportParams (startDate, endDate, groupBy, categoryId)
   * @returns Promise<unknown> - Backend chưa có type cụ thể
   */
  async getSalesReport(params: SalesReportParams): Promise<unknown> {
    return this.custom<unknown>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.SALES_REPORT,
      undefined,
      params
    );
  }

  /**
   * GET /api/admin/reports/top-products
   * Lấy top sản phẩm bán chạy
   * 
   * @param params - TopItemsReportParams (startDate, endDate, page, pageSize)
   * @returns Promise<PagedList<TopProductDto>>
   */
  async getTopProducts(params: TopItemsReportParams): Promise<PagedList<unknown>> {
    return this.custom<PagedList<unknown>>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.TOP_PRODUCTS,
      undefined,
      params
    );
  }

  /**
   * GET /api/admin/reports/top-customers
   * Lấy top khách hàng mua nhiều
   * 
   * @param params - TopItemsReportParams (startDate, endDate, page, pageSize)
   * @returns Promise<PagedList<TopCustomerDto>>
   */
  async getTopCustomers(params: TopItemsReportParams): Promise<PagedList<unknown>> {
    return this.custom<PagedList<unknown>>(
      'get',
      API_CONFIG.ENDPOINTS.ADMIN.TOP_CUSTOMERS,
      undefined,
      params
    );
  }

  /**
   * GET /api/admin/reports/promotion
   * Lấy báo cáo khuyến mãi
   * 
   * @param params - PromotionReportParams (startDate, endDate, promoId, includeOrderDetails)
   * @returns Promise<unknown> - Backend chưa có type cụ thể
   */
  async getPromotionReport(params: {
    startDate?: string;
    endDate?: string;
    promoId?: number;
    includeOrderDetails?: boolean;
  }): Promise<unknown> {
    return this.custom<unknown>(
      'get',
      '/api/admin/reports/promotion',
      undefined,
      params
    );
  }

  /**
   * GET /api/admin/reports/inventory-forecast
   * Lấy dự báo tồn kho
   * 
   * @param params - InventoryForecastParams
   * @returns Promise<unknown> - Backend chưa có type cụ thể
   */
  async getInventoryForecast(params: {
    productId?: number;
    categoryId?: number;
    lookbackMonths?: number;
    leadTimeDays?: number;
    safetyStockMultiplier?: number;
  }): Promise<unknown> {
    return this.custom<unknown>(
      'get',
      '/api/admin/reports/inventory-forecast',
      undefined,
      params
    );
  }
}

// Export singleton instance
export const reportApiService = new ReportApiService();

