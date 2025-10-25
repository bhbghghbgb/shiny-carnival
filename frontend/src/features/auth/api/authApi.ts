import axiosClient, { type ApiResponse, type LoginResponse, tokenUtils } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';
import type { LoginRequest } from "../types/api.ts";

// Auth API functions
export const authApi = {
  /**
   * Đăng nhập người dùng
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axiosClient.post<ApiResponse<LoginResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Lưu tokens vào localStorage nếu đăng nhập thành công
      if (!response.data.isError && response.data.data) {
        tokenUtils.setToken(response.data.data.token);
        // Note: Refresh token sẽ được implement khi backend hỗ trợ
        // tokenUtils.setRefreshToken(response.data.data.refreshToken);
      }

      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Đăng nhập thất bại',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axiosClient.post<ApiResponse<LoginResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      // Cập nhật token mới nếu refresh thành công
      if (!response.data.isError && response.data.data) {
        tokenUtils.setToken(response.data.data.token);
      }

      return response.data;
    } catch (error: any) {
      // Nếu refresh token thất bại, xóa tất cả tokens
      tokenUtils.clearAllTokens();
      throw {
        isError: true,
        message: error.message || 'Refresh token thất bại',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Đăng xuất người dùng
   */
  logout: async (): Promise<void> => {
    try {
      // Gọi API logout nếu backend hỗ trợ
      await axiosClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Bỏ qua lỗi từ server khi logout
      console.warn('Logout API failed:', error);
    } finally {
      // Luôn xóa tokens khỏi localStorage
      tokenUtils.clearAllTokens();
    }
  },

  /**
   * Kiểm tra trạng thái đăng nhập
   */
  isAuthenticated: (): boolean => {
    const token = tokenUtils.getToken();
    if (!token) return false;

    try {
      // Kiểm tra token có hết hạn không (decode JWT payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      // Token không hợp lệ
      tokenUtils.clearAllTokens();
      return false;
    }
  },

  /**
   * Lấy thông tin user từ token
   */
  getCurrentUser: (): LoginResponse['user'] | null => {
    const token = tokenUtils.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.userId,
        username: payload.username,
        fullName: payload.fullName,
        role: payload.role
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
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
