import axiosClient, { type ApiResponse, type PagedRequest, type PagedList } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';
import type { PromotionEntity } from '../types/entity.ts';
import type { CreatePromotionRequest, UpdatePromotionRequest, PromotionFilterParams, ValidatePromoRequest } from '../types/api.ts';

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
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
        isError: false,
        message: "",
        timestamp: "",
        ...response,
        data: response.data?.data?.items || []
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
  validatePromoCode: async (payload: ValidatePromoRequest): Promise<ApiResponse<PromotionEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<PromotionEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PROMOTION_VALIDATE,
        payload
      );
      return response.data;
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
