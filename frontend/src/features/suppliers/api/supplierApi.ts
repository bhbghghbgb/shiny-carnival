import axiosClient, { type ApiResponse, type PagedRequest, type PagedList } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api.config.ts';
import type { SupplierEntity } from '../types/entity.ts';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api.ts';

// Supplier API functions
export const supplierApi = {
  /**
   * Lấy danh sách nhà cung cấp với phân trang
   */
  getSuppliers: async (params?: PagedRequest): Promise<ApiResponse<PagedList<SupplierEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<SupplierEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.SUPPLIERS,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách nhà cung cấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy tất cả nhà cung cấp (không phân trang) - dùng cho dropdown
   */
  getAllSuppliers: async (): Promise<ApiResponse<SupplierEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<SupplierEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.SUPPLIERS,
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
        message: error.message || 'Không thể lấy danh sách nhà cung cấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin nhà cung cấp theo ID
   */
  getSupplierById: async (id: number): Promise<ApiResponse<SupplierEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<SupplierEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.SUPPLIER_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin nhà cung cấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo nhà cung cấp mới (Admin only)
   */
  createSupplier: async (supplierData: CreateSupplierRequest): Promise<ApiResponse<SupplierEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<SupplierEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.SUPPLIERS,
        supplierData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo nhà cung cấp mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật thông tin nhà cung cấp (Admin only)
   */
  updateSupplier: async (id: number, supplierData: UpdateSupplierRequest): Promise<ApiResponse<SupplierEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<SupplierEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.SUPPLIER_BY_ID(id),
        supplierData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật nhà cung cấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa nhà cung cấp (Admin only)
   */
  deleteSupplier: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.SUPPLIER_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa nhà cung cấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default supplierApi;
