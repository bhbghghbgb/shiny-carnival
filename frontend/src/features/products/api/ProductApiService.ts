import { BaseApiService } from '../../../lib/api/base';
import axiosClient from '../../../lib/api/axios';
import { API_CONFIG } from '../../../config/api.config';
import type { ProductEntity, ProductDetailsDto } from '../types/entity';
import type { CreateProductRequest, UpdateProductRequest } from '../types/api';
import type { PagedList, PagedRequest } from '../../../lib/api/types/api.types';

/**
 * ProductApiService - Extends BaseApiService với custom methods cho Products
 * 
 * Cung cấp CRUD operations chuẩn từ BaseApiService và có thể thêm custom methods
 */
export class ProductApiService extends BaseApiService<
  ProductEntity,
  CreateProductRequest,
  UpdateProductRequest
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
      axiosInstance: axiosClient,
    });
  }

  /**
   * Search products by barcode
   * 
   * @param barcode - Barcode của sản phẩm
   * @returns Promise<ProductEntity[]>
   */
  async searchByBarcode(barcode: string): Promise<ProductEntity[]> {
    const result = await this.getPaginated({ search: barcode, page: 1, pageSize: 100 });
    return result.items;
  }

  /**
   * Get products by category
   * 
   * @param categoryId - ID của category
   * @param params - Pagination params (không bao gồm categoryId)
   * @returns Promise<PagedList<ProductEntity>>
   */
  async getProductsByCategory(
    categoryId: number,
    params?: Omit<PagedRequest, 'categoryId'>
  ): Promise<PagedList<ProductEntity>> {
    return this.getPaginated({
      ...params,
      categoryId,
    } as PagedRequest);
  }

  /**
   * Get products by supplier
   * 
   * @param supplierId - ID của supplier
   * @param params - Pagination params (không bao gồm supplierId)
   * @returns Promise<PagedList<ProductEntity>>
   */
  async getProductsBySupplier(
    supplierId: number,
    params?: Omit<PagedRequest, 'supplierId'>
  ): Promise<PagedList<ProductEntity>> {
    return this.getPaginated({
      ...params,
      supplierId,
    } as PagedRequest);
  }

  /**
   * GET product details: GET /api/admin/products/{id}
   * Lấy chi tiết sản phẩm bao gồm category name, supplier name, inventory quantity
   * 
   * Sử dụng getById() từ BaseApiService với type assertion để trả về ProductDetailsDto
   * thay vì ProductEntity (vì backend trả về ProductResponseDto với đầy đủ thông tin)
   */
  async getProductDetails(id: number): Promise<ProductDetailsDto> {
    // Sử dụng getById() từ BaseApiService và cast type sang ProductDetailsDto
    // vì backend trả về ProductResponseDto (có categoryName, supplierName, inventoryQuantity, createdAt)
    return this.getById(id) as Promise<ProductDetailsDto>;
  }
}

// Export singleton instance
export const productApiService = new ProductApiService();

