import axiosClient, { type ApiResponse, type PagedRequest, type PagedList } from '../../../lib/api/axios.ts';
import { API_CONFIG } from '../../../config/api.config.ts';
import type { CreateCustomerRequest, UpdateCustomerRequest } from "../types/api.ts";
import type { CustomerEntity } from "../types/entity.ts";



// Customer API functions
export const customerApi = {
  /**
   * Lấy danh sách khách hàng với phân trang
   */
  getCustomers: async (params?: PagedRequest): Promise<ApiResponse<PagedList<CustomerEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<CustomerEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMERS,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách khách hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin khách hàng theo ID
   */
  getCustomerById: async (id: number): Promise<ApiResponse<CustomerEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<CustomerEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMER_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin khách hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo khách hàng mới
   */
  createCustomer: async (customerData: CreateCustomerRequest): Promise<ApiResponse<CustomerEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<CustomerEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMERS,
        customerData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo khách hàng mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật thông tin khách hàng
   */
  updateCustomer: async (id: number, customerData: UpdateCustomerRequest): Promise<ApiResponse<CustomerEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<CustomerEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMER_BY_ID(id),
        customerData
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật khách hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa khách hàng
   */
  deleteCustomer: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMER_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa khách hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tìm kiếm khách hàng theo số điện thoại
   */
  searchByPhone: async (phone: string): Promise<ApiResponse<CustomerEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<CustomerEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMERS,
        { params: { search: phone, pageSize: 10 } },
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
        message: error.message || 'Không thể tìm kiếm khách hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tìm kiếm khách hàng theo email
   */
  searchByEmail: async (email: string): Promise<ApiResponse<CustomerEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<CustomerEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.CUSTOMERS,
        { params: { search: email, pageSize: 10 } },
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
        message: error.message || 'Không thể tìm kiếm khách hàng',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default customerApi;
