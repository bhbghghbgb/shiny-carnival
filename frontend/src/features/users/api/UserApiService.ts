import { BaseApiService } from '../../../lib/api/base';
import axiosClient from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api.config';
import type { UserEntity } from '../types/entity';
import type { CreateUserRequest, UpdateUserRequest } from '../types/api';
import type { PagedRequest } from '../../../lib/api/types/api.types';

/**
 * UserApiService - Extends BaseApiService với custom methods cho Users
 * 
 * Cung cấp CRUD operations chuẩn từ BaseApiService và có thể thêm custom methods
 */
export class UserApiService extends BaseApiService<
  UserEntity,
  CreateUserRequest,
  UpdateUserRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.USERS,
      axiosInstance: axiosClient,
    });
  }

  /**
   * Lấy danh sách Staff users (dùng cho dropdown)
   * 
   * @param params - Pagination params
   * @returns Promise<UserEntity[]>
   */
  async getStaffUsers(params?: PagedRequest): Promise<UserEntity[]> {
    const pagedData = await this.getPaginated({
      page: 1,
      pageSize: 1000,
      ...params,
    });
    // Filter staff users ở client side
    return pagedData.items.filter(
      (user: UserEntity) => user.role === API_CONFIG.USER_ROLES.STAFF
    );
  }

  /**
   * Kiểm tra username có tồn tại không
   * 
   * @param username - Username cần kiểm tra
   * @returns Promise<boolean>
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const pagedData = await this.getPaginated({
        search: username,
        pageSize: 1,
      });
      return pagedData.items.some(
        (user: UserEntity) => user.username.toLowerCase() === username.toLowerCase()
      );
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const userApiService = new UserApiService();

