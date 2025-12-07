import axiosClient, { type ApiResponse, type PagedRequest, type PagedList } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';
import type { UserEntity } from '../types/entity.ts';
import type { CreateUserRequest, UpdateUserRequest } from '../types/api.ts';

/**
 * Convert camelCase object keys sang PascalCase
 * Backend API sử dụng PascalCase cho query parameters
 */
function toPascalCaseParams(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      result[pascalKey] = value;
    }
  }
  return result;
}

// User API functions (Admin only)
export const userApi = {
  /**
   * Lấy danh sách người dùng với phân trang (Admin only)
   */
  getUsers: async (params?: PagedRequest): Promise<ApiResponse<PagedList<UserEntity>>> => {
    try {
      // Convert params sang PascalCase để khớp với backend
      const pascalParams = params ? toPascalCaseParams(params) : undefined;
      const response = await axiosClient.get<ApiResponse<PagedList<UserEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        { params: pascalParams },
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách người dùng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin người dùng theo ID (Admin only)
   */
  getUserById: async (id: number): Promise<ApiResponse<UserEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<UserEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.USER_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin người dùng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo người dùng mới (Admin only)
   */
  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<UserEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<UserEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        userData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo người dùng mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật thông tin người dùng (Admin only)
   */
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<ApiResponse<UserEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<UserEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.USER_BY_ID(id),
        userData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật người dùng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa người dùng (Admin only)
   */
  deleteUser: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.USER_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa người dùng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy danh sách Staff (dùng cho dropdown)
   */
  getStaffUsers: async (): Promise<ApiResponse<UserEntity[]>> => {
    try {
      // Convert params sang PascalCase
      const params = toPascalCaseParams({
        pageSize: 1000,
        role: API_CONFIG.USER_ROLES.STAFF
      });
      const response = await axiosClient.get<ApiResponse<PagedList<UserEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        { params }
      );

      // Filter staff users ở client side nếu backend chưa hỗ trợ
      const staffUsers = response.data?.data?.items.filter(user => user.role === API_CONFIG.USER_ROLES.STAFF) || [];

      return {
          isError: false,
          message: "",
          timestamp: "",
          ...response,
        data: staffUsers
      };
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách nhân viên',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Kiểm tra username có tồn tại không
   */
  checkUsernameExists: async (username: string): Promise<boolean> => {
    try {
      // Convert params sang PascalCase
      const params = toPascalCaseParams({ 
        search: username, 
        pageSize: 1 
      });
      const response = await axiosClient.get<ApiResponse<PagedList<UserEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        { params }
      );

      const users = response.data?.data?.items || [];
      return users.some(user => user.username.toLowerCase() === username.toLowerCase());
    } catch (error: any) {
      // Nếu có lỗi, giả sử username không tồn tại
      return false;
    }
  }
};

export default userApi;
