import { BaseApiService } from '../../../lib/api/base';
import axiosClient from '../../../lib/api/axios';
import { API_CONFIG } from '../../../config/api.config';
import type { ProductEntity } from '../types/entity';
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
    return this.getAll({ search: barcode });
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
}

// Export singleton instance
export const productApiService = new ProductApiService();

