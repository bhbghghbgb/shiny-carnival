import axiosClient, { ApiResponse } from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';

// Types cho Product API
export interface ProductEntity {
  id: number;
  categoryId: number;
  supplierId: number;
  productName: string;
  barcode: string;
  price: number;
  unit: string;
  createdAt: string;
}

export interface CreateProductRequest {
  categoryId: number;
  supplierId: number;
  productName: string;
  barcode: string;
  price: number;
  unit: string;
}

export interface UpdateProductRequest extends ProductEntity {}

export interface PagedRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
  categoryId?: number;
  supplierId?: number;
}

export interface PagedList<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: T[];
}

// Product API functions
export const productApi = {
  /**
   * Lấy danh sách sản phẩm với phân trang và lọc
   */
  getProducts: async (params?: PagedRequest): Promise<ApiResponse<PagedList<ProductEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params },
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách sản phẩm',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin sản phẩm theo ID
   */
  getProductById: async (id: number): Promise<ApiResponse<ProductEntity>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ProductEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCT_BY_ID(id)
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy thông tin sản phẩm',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tạo sản phẩm mới (Admin only)
   */
  createProduct: async (productData: CreateProductRequest): Promise<ApiResponse<ProductEntity>> => {
    try {
      const response = await axiosClient.post<ApiResponse<ProductEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        productData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tạo sản phẩm mới',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Cập nhật thông tin sản phẩm (Admin only)
   */
  updateProduct: async (id: number, productData: UpdateProductRequest): Promise<ApiResponse<ProductEntity>> => {
    try {
      const response = await axiosClient.put<ApiResponse<ProductEntity>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCT_BY_ID(id),
        productData
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể cập nhật sản phẩm',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Xóa sản phẩm (Admin only)
   */
  deleteProduct: async (id: number): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<boolean>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCT_BY_ID(id)
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể xóa sản phẩm',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Tìm kiếm sản phẩm theo barcode
   */
  searchByBarcode: async (barcode: string): Promise<ApiResponse<ProductEntity[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params: { search: barcode, pageSize: 10 } },
      );
      
      // Trả về items thay vì PagedList để dễ sử dụng
      return {
        ...response,
        data: response.data?.items || []
      };
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể tìm kiếm sản phẩm',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy sản phẩm theo danh mục
   */
  getProductsByCategory: async (categoryId: number, params?: Omit<PagedRequest, 'categoryId'>): Promise<ApiResponse<PagedList<ProductEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params: { ...params, categoryId } },
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy sản phẩm theo danh mục',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy sản phẩm theo nhà cung cấp
   */
  getProductsBySupplier: async (supplierId: number, params?: Omit<PagedRequest, 'supplierId'>): Promise<ApiResponse<PagedList<ProductEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params: { ...params, supplierId } },
      );
      return response;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy sản phẩm theo nhà cung cấp',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  }
};

export default productApi;
