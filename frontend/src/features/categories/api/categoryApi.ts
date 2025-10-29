import axiosClient, { type ApiResponse, type PagedList, type PagedRequest } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';
import type { CategoryEntity } from "../types/entity.ts";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../types/api.ts";

// Category API functions
export const categoryApi = {
  /**
   * Lấy danh sách danh mục với phân trang
   */
  getCategories: async (params?: PagedRequest): Promise<ApiResponse<PagedList<CategoryEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<CategoryEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách danh mục',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy tất cả danh mục (không phân trang) - dùng cho dropdown
   */
  getAllCategories: async (): Promise<ApiResponse<CategoryEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<CategoryEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES,
        { params: { pageSize: 1000 } },
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
        message: error.message || 'Không thể lấy danh sách danh mục',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin danh mục theo ID
   */
  getCategoryById: async (id: number): Promise<ApiResponse<CategoryEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<CategoryEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.CATEGORY_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin danh mục',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo danh mục mới (Admin only)
   */
  createCategory: async (categoryData: CreateCategoryRequest): Promise<ApiResponse<CategoryEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<CategoryEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.CATEGORIES,
        categoryData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo danh mục mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật thông tin danh mục (Admin only)
   */
  updateCategory: async (id: number, categoryData: UpdateCategoryRequest): Promise<ApiResponse<CategoryEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<CategoryEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.CATEGORY_BY_ID(id),
        categoryData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật danh mục',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa danh mục (Admin only)
   */
  deleteCategory: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.CATEGORY_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa danh mục',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default categoryApi;
