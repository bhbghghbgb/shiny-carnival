import axiosClient from '../../../lib/api/axios.ts';
import type { ApiResponse, PagedList } from '../../../lib/api/types/api.types';
import { API_CONFIG } from '../../../config/api.config.ts';
import type { RevenueReportDto } from '../types/entity.ts';
import type { RevenueReportParams, SalesReportParams, TopItemsReportParams } from '../types/api.ts';

// Report API functions (Admin only)
export const reportApi = {
  /**
   * Lấy báo cáo doanh thu theo khoảng thời gian (Admin only)
   */
  getRevenueReport: async (params: RevenueReportParams): Promise<ApiResponse<RevenueReportDto>> => {
    try {
      const response = await axiosClient.get<ApiResponse<RevenueReportDto>>(
        API_CONFIG.ENDPOINTS.ADMIN.REVENUE_REPORT,
        { params },
      );
      return response as unknown as ApiResponse<RevenueReportDto>;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể lấy báo cáo doanh thu';
      throw {
        isError: true,
        message,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy báo cáo doanh thu theo ngày
   */
  getDailyRevenue: async (startDate: string, endDate: string): Promise<ApiResponse<RevenueReportDto>> => {
    return reportApi.getRevenueReport({
      startDate,
      endDate,
      groupBy: 'day'
    });
  },

  /**
   * Lấy báo cáo doanh thu theo tuần
   */
  getWeeklyRevenue: async (startDate: string, endDate: string): Promise<ApiResponse<RevenueReportDto>> => {
    return reportApi.getRevenueReport({
      startDate,
      endDate,
      groupBy: 'week'
    });
  },

  /**
   * Lấy báo cáo doanh thu theo tháng
   */
  getMonthlyRevenue: async (startDate: string, endDate: string): Promise<ApiResponse<RevenueReportDto>> => {
    return reportApi.getRevenueReport({
      startDate,
      endDate,
      groupBy: 'month'
    });
  },

  /**
   * Lấy báo cáo doanh thu hôm nay
   */
  getTodayRevenue: async (): Promise<ApiResponse<RevenueReportDto>> => {
    const today = new Date().toISOString().split('T')[0];
    return reportApi.getDailyRevenue(today, today);
  },

  /**
   * Lấy báo cáo doanh thu tuần này
   */
  getThisWeekRevenue: async (): Promise<ApiResponse<RevenueReportDto>> => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    return reportApi.getDailyRevenue(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    );
  },

  /**
   * Lấy báo cáo doanh thu tháng này
   */
  getThisMonthRevenue: async (): Promise<ApiResponse<RevenueReportDto>> => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return reportApi.getDailyRevenue(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
  },

  /**
   * Lấy báo cáo doanh thu năm này
   */
  getThisYearRevenue: async (): Promise<ApiResponse<RevenueReportDto>> => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    return reportApi.getMonthlyRevenue(
      startOfYear.toISOString().split('T')[0],
      endOfYear.toISOString().split('T')[0]
    );
  },

  /**
   * Báo cáo bán hàng tổng hợp
   */
  getSalesReport: async (params: SalesReportParams): Promise<ApiResponse<unknown>> => {
    try {
      const response = await axiosClient.get<ApiResponse<unknown>>(
        API_CONFIG.ENDPOINTS.ADMIN.SALES_REPORT,
        { params }
      );
      return response as unknown as ApiResponse<unknown>;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể lấy báo cáo bán hàng';
      throw {
        isError: true,
        message,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Top sản phẩm bán chạy
   */
  getTopProducts: async (params: TopItemsReportParams): Promise<ApiResponse<PagedList<unknown>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<unknown>>>(
        API_CONFIG.ENDPOINTS.ADMIN.TOP_PRODUCTS,
        { params }
      );
      return response as unknown as ApiResponse<PagedList<unknown>>;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể lấy top sản phẩm';
      throw {
        isError: true,
        message,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Top khách hàng mua nhiều
   */
  getTopCustomers: async (params: TopItemsReportParams): Promise<ApiResponse<PagedList<unknown>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<unknown>>>(
        API_CONFIG.ENDPOINTS.ADMIN.TOP_CUSTOMERS,
        { params }
      );
      return response as unknown as ApiResponse<PagedList<unknown>>;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không thể lấy top khách hàng';
      throw {
        isError: true,
        message,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default reportApi;
