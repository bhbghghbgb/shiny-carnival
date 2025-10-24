import axiosClient, {type ApiResponse, type PagedRequest, type PagedList} from '../../../lib/axios';
import { API_CONFIG, type UserRole } from '../../../config/api';

// Types cho User API
export interface UserEntity {
  id: number;
  username: string;
  password?: string; // Optional cho update, không trả về trong response
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface UpdateUserRequest extends UserEntity {
  password?: string; // Gửi chuỗi rỗng nếu không muốn đổi mật khẩu
}

// User API functions (Admin only)
export const userApi = {
  /**
   * Lấy danh sách người dùng với phân trang (Admin only)
   */
  getUsers: async (params?: PagedRequest): Promise<ApiResponse<PagedList<UserEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<UserEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        { params },
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
      const response = await axiosClient.get<ApiResponse<PagedList<UserEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        {
          params: {
            pageSize: 1000,
            // Note: Backend cần hỗ trợ filter theo role
            // role: API_CONFIG.USER_ROLES.STAFF
          }
        }
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
      const response = await axiosClient.get<ApiResponse<PagedList<UserEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.USERS,
        { params: { search: username, pageSize: 1 } }
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
