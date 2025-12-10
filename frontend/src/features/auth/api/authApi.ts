import axiosClient, { resetCsrfToken } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api.config.ts';
import type { LoginRequest, LoginResponse } from "../types/api.ts";
import type { ApiResponse } from '../../../lib/api/types/api.types';

// Auth API functions
export const authApi = {
  /**
   * Đăng nhập người dùng
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      // Interceptor đã unwrap response.data, nên response đã là ApiResponse
      const response = await axiosClient.post<ApiResponse<LoginResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      ) as unknown as ApiResponse<LoginResponse>;

      // Tokens được lưu trong httpOnly cookies bởi backend
      // Không cần lưu vào localStorage nữa
      // User info có thể được lưu trong memory/context nếu cần

      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại';
      throw {
        isError: true,
        message: errorMessage,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Refresh access token
   * Backend sẽ đọc refresh token từ cookie tự động
   */
  refreshToken: async (): Promise<ApiResponse<LoginResponse>> => {
    try {
      // Không cần gửi tokens trong body - backend đọc từ cookies
      // Interceptor đã unwrap response.data, nên response đã là ApiResponse
      const response = await axiosClient.post<ApiResponse<LoginResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        {} // Empty body - backend đọc từ cookies
      ) as unknown as ApiResponse<LoginResponse>;

      // Tokens mới đã được set vào cookies bởi backend
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Refresh token thất bại';
      throw {
        isError: true,
        message: errorMessage,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Đăng xuất người dùng
   * Backend sẽ đọc refresh token từ cookie và xóa cookies
   */
  logout: async (): Promise<void> => {
    try {
      // Không cần gửi refresh token - backend đọc từ cookie
      await axiosClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      // Bỏ qua lỗi từ server khi logout
      console.warn('Logout API failed:', error);
    } finally {
      // Reset CSRF token khi logout
      resetCsrfToken();
    }
    // Cookies được xóa bởi backend
  },

  /**
   * Setup Admin đầu tiên (chỉ hoạt động khi chưa có Admin nào)
   */
  setupAdmin: async (userData: {
    username: string;
    password: string;
    fullName: string;
    role: number;
  }): Promise<ApiResponse<LoginResponse['user']>> => {
    try {
      // Interceptor đã unwrap response.data, nên response đã là ApiResponse
      const response = await axiosClient.post<ApiResponse<LoginResponse['user']>>(
        API_CONFIG.ENDPOINTS.AUTH.SETUP_ADMIN,
        userData
      ) as unknown as ApiResponse<LoginResponse['user']>;
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tạo tài khoản Admin';
      throw {
        isError: true,
        message: errorMessage,
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Kiểm tra trạng thái đăng nhập
   * Với httpOnly cookies, không thể đọc token từ frontend
   * Nên cần lưu user info trong memory/context sau khi login
   * Hoặc gọi API /me để check auth status
   */
  isAuthenticated: (): boolean => {
    // Với httpOnly cookies, không thể check token từ frontend
    // Cần implement endpoint /me hoặc lưu user info trong context
    // Tạm thời return true nếu có user info trong memory
    // TODO: Implement proper auth check via API endpoint
    return false; // Sẽ được implement sau với user context
  },

  /**
   * Lấy thông tin user từ token
   * Với httpOnly cookies, không thể đọc token từ frontend
   * Cần lưu user info trong memory/context sau khi login
   */
  getCurrentUser: (): LoginResponse['user'] | null => {
    // Với httpOnly cookies, không thể đọc token từ frontend
    // Cần lưu user info trong React Context/State sau khi login
    // TODO: Implement user context/store
    return null; // Sẽ được implement sau với user context
  },

  /**
   * Kiểm tra quyền của user
   */
  hasRole: (requiredRole: number): boolean => {
    const user = authApi.getCurrentUser();
    if (!user) return false;

    // Admin (role 0) có tất cả quyền
    if (user.role === API_CONFIG.USER_ROLES.ADMIN) return true;

    // Kiểm tra role cụ thể
    return user.role === requiredRole;
  },

  /**
   * Kiểm tra user có phải Admin không
   */
  isAdmin: (): boolean => {
    return authApi.hasRole(API_CONFIG.USER_ROLES.ADMIN);
  },

  /**
   * Kiểm tra user có phải Staff không
   */
  isStaff: (): boolean => {
    return authApi.hasRole(API_CONFIG.USER_ROLES.STAFF);
  }
};

export default authApi;
