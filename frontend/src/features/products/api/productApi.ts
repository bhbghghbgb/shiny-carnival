import axiosClient, {type ApiResponse, type PagedList, type PagedRequest} from '../../../lib/axios';
import {API_CONFIG} from '../../../config/api';
import type { ProductEntity } from "../product";

export interface CreateProductRequest {
  categoryId: number;
  supplierId: number;
  productName: string;
  barcode: string;
  price: number;
  unit: string;
}

export type UpdateProductRequest = ProductEntity

// Product API functions
export const productApi = {
  /**
   * Lấy danh sách sản phẩm với phân trang và lọc
   */
  getProducts: async (params?: PagedRequest): Promise<ApiResponse<PagedList<ProductEntity[]>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity[]>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params },
      );
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
      return response.data;
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
          // 1. Gọi API để lấy danh sách sản phẩm theo barcode
          const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
              API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
              { params: { search: barcode, pageSize: 10 } },
          );

          // 2. Trích xuất dữ liệu sản phẩm từ phản hồi
          // Sử dụng "optional chaining" (?.) và "nullish coalescing" (??) để xử lý an toàn các trường hợp null/undefined
          const products = response.data.data?.items ?? [];

          // 3. Trả về kết quả thành công với danh sách sản phẩm tìm được
          return {
              isError: false,
              message: "Tìm kiếm thành công", // Cung cấp message rõ ràng hơn
              data: products,
              timestamp: new Date().toISOString(), // Thêm timestamp cho sự nhất quán
          };

      } catch (error: any) {
          // 4. Xử lý lỗi một cách nhất quán
          // Ghi lại lỗi để debug (tùy chọn nhưng rất hữu ích)
          console.error("Lỗi khi tìm kiếm sản phẩm bằng barcode:", error);

          // Ném ra một đối tượng lỗi có cấu trúc tương tự như phản hồi thành công
          throw {
              isError: true,
              message: error.response?.data?.message || 'Không thể tìm kiếm sản phẩm do lỗi hệ thống.',
              data: null,
              timestamp: new Date().toISOString(),
          };
      }
  }
    ,

  /**
   * Lấy sản phẩm theo danh mục
   */
  getProductsByCategory: async (categoryId: number, params?: Omit<PagedRequest, 'categoryId'>): Promise<ApiResponse<PagedList<ProductEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params: { ...params, categoryId } },
      );
      return response.data;
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
      return response.data;
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
