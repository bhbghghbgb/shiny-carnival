import axiosClient, {type ApiResponse} from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';

// Types cho Report API
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

export interface RevenueReportParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  groupBy?: 'day' | 'week' | 'month'; // Default: 'day'
}

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
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy báo cáo doanh thu',
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
  }
};

export default reportApi;
