import axiosClient, { ApiResponse } from '../../../lib/axios';
import { API_CONFIG, DiscountType, PromotionStatus } from '../../../config/api';
import { PagedRequest, PagedList } from '../products/api/productApi';

// Types cho Promotion API
export interface PromotionEntity {
  id: number;
  promoCode: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  status: PromotionStatus;
}

export interface CreatePromotionRequest {
  promoCode: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  usageLimit: number;
  status: PromotionStatus;
}

export interface UpdatePromotionRequest extends PromotionEntity {}

export interface PromotionFilterParams extends PagedRequest {
  status?: PromotionStatus;
}

// Promotion API functions
export const promotionApi = {
  /**
   * Lấy danh sách khuyến mãi với phân trang và lọc
   */
  getPromotions: async (params?: PromotionFilterParams): Promise<ApiResponse<PagedList<PromotionEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<PromotionEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTIONS,
        { params },
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách khuyến mãi',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin khuyến mãi theo ID
   */
  getPromotionById: async (id: number): Promise<ApiResponse<PromotionEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PromotionEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_BY_ID(id)
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin khuyến mãi',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo khuyến mãi mới (Admin only)
   */
  createPromotion: async (promotionData: CreatePromotionRequest): Promise<ApiResponse<PromotionEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<PromotionEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTIONS,
        promotionData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo khuyến mãi mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật thông tin khuyến mãi (Admin only)
   */
  updatePromotion: async (id: number, promotionData: UpdatePromotionRequest): Promise<ApiResponse<PromotionEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<PromotionEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_BY_ID(id),
        promotionData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật khuyến mãi',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa khuyến mãi (Admin only)
   */
  deletePromotion: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_BY_ID(id)
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa khuyến mãi',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy danh sách khuyến mãi đang hoạt động
   */
  getActivePromotions: async (): Promise<ApiResponse<PromotionEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<PromotionEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTIONS,
        {
          params: {
            status: API_CONFIG.PROMOTION_STATUS.ACTIVE,
            pageSize: 1000
          }
        }
      );
      
      return {
        ...response,
        data: response.data?.items || []
      };
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách khuyến mãi đang hoạt động',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Kiểm tra mã khuyến mãi có hợp lệ không
   */
  validatePromoCode: async (promoCode: string, orderAmount: number): Promise<ApiResponse<PromotionEntity>> => {
    try {
      // Tìm khuyến mãi theo mã
      const response = await axiosClient.get<ApiResponse<PagedList<PromotionEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTIONS,
        {
          params: {
            search: promoCode,
            status: API_CONFIG.PROMOTION_STATUS.ACTIVE,
            pageSize: 1
          }
        }
      );

      const promotions = response.data?.items || [];
      if (promotions.length === 0) {
        throw new Error('Mã khuyến mãi không tồn tại hoặc đã hết hạn');
      }

      const promotion = promotions[0];
      
      // Kiểm tra các điều kiện
      const now = new Date();
      const startDate = new Date(promotion.startDate);
      const endDate = new Date(promotion.endDate);

      if (now < startDate || now > endDate) {
        throw new Error('Mã khuyến mãi chưa có hiệu lực hoặc đã hết hạn');
      }

      if (orderAmount < promotion.minOrderAmount) {
        throw new Error(`Đơn hàng phải có giá trị tối thiểu ${promotion.minOrderAmount.toLocaleString('vi-VN')}đ`);
      }

      if (promotion.usedCount >= promotion.usageLimit) {
        throw new Error('Mã khuyến mãi đã hết lượt sử dụng');
      }

      return {
        isError: false,
        message: 'Mã khuyến mãi hợp lệ',
        data: promotion,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể kiểm tra mã khuyến mãi',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tính toán số tiền giảm giá
   */
  calculateDiscount: (promotion: PromotionEntity, orderAmount: number): number => {
    if (promotion.discountType === API_CONFIG.DISCOUNT_TYPES.PERCENT) {
      return (orderAmount * promotion.discountValue) / 100;
    } else {
      return promotion.discountValue;
    }
  }
};

export default promotionApi;
