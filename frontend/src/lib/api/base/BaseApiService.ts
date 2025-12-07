import type { AxiosInstance } from 'axios';
import type { ApiResponse, PagedList, PagedRequest } from '../../types/api.types';
import { unwrapResponse } from './apiResponseAdapter';
import type { ApiServiceInterface } from './ApiServiceInterface';

/**
 * QueryParams - Type cho query parameters (camelCase)
 */
export interface QueryParams {
  [key: string]: any;
}

/**
 * ApiConfig - Configuration cho BaseApiService
 */
export interface ApiConfig<TData = any, TCreate = any, TUpdate = any> {
  endpoint: string;
  axiosInstance: AxiosInstance;
}

/**
 * Convert camelCase object keys sang PascalCase
 * Backend API sử dụng PascalCase cho query parameters
 * 
 * @param obj - Object với keys camelCase
 * @returns Object với keys PascalCase
 * 
 * @example
 * ```typescript
 * toPascalCaseParams({ page: 1, pageSize: 20, categoryId: 1 })
 * // => { Page: 1, PageSize: 20, CategoryId: 1 }
 * ```
 */
function toPascalCaseParams(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      // Convert camelCase to PascalCase
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      result[pascalKey] = value;
    }
  }
  return result;
}

/**
 * BaseApiService - Base class cho tất cả API services
 * 
 * Xử lý:
 * - ApiResponse<T> wrapper (unwrap data field, check isError)
 * - PagedList<T> pagination
 * - Error handling tự động
 * - Query params conversion (camelCase → PascalCase)
 * 
 * @template TData - Type của entity data
 * @template TCreate - Type của create request
 * @template TUpdate - Type của update request
 */
export class BaseApiService<TData = any, TCreate = any, TUpdate = any>
  implements ApiServiceInterface<TData, TCreate, TUpdate>
{
  protected endpoint: string;
  protected axios: AxiosInstance;

  constructor(config: ApiConfig<TData, TCreate, TUpdate>) {
    this.endpoint = config.endpoint;
    this.axios = config.axiosInstance;
  }

  /**
   * GET all - Lấy danh sách với query params (không phân trang)
   * Trả về mảng items trực tiếp
   * 
   * @param params - Query parameters (camelCase) - sẽ được convert sang PascalCase
   * @returns Promise<TData[]>
   */
  async getAll(params?: QueryParams): Promise<TData[]> {
    const pascalParams = params ? toPascalCaseParams(params) : undefined;
    const response = await this.axios.get<ApiResponse<TData[]>>(
      this.endpoint,
      { params: pascalParams }
    );
    return unwrapResponse(response);
  }

  /**
   * GET paginated - Lấy danh sách với phân trang
   * Trả về PagedList<TData> với pagination metadata
   * 
   * @param params - PagedRequest (camelCase) - sẽ được convert sang PascalCase
   * @returns Promise<PagedList<TData>>
   */
  async getPaginated(params?: PagedRequest): Promise<PagedList<TData>> {
    const pascalParams = params ? toPascalCaseParams(params) : undefined;
    const response = await this.axios.get<ApiResponse<PagedList<TData>>>(
      this.endpoint,
      { params: pascalParams }
    );
    return unwrapResponse(response);
  }

  /**
   * GET by ID - Lấy chi tiết một item
   * 
   * @param id - ID của item (string hoặc number)
   * @returns Promise<TData>
   */
  async getById(id: string | number): Promise<TData> {
    const response = await this.axios.get<ApiResponse<TData>>(
      `${this.endpoint}/${id}`
    );
    return unwrapResponse(response);
  }

  /**
   * POST - Create - Tạo mới item
   * 
   * @param data - Create request data
   * @returns Promise<TData>
   */
  async create(data: TCreate): Promise<TData> {
    const response = await this.axios.post<ApiResponse<TData>>(
      this.endpoint,
      data
    );
    return unwrapResponse(response);
  }

  /**
   * PUT - Update - Cập nhật toàn bộ item
   * 
   * @param id - ID của item
   * @param data - Update request data
   * @returns Promise<TData>
   */
  async update(id: string | number, data: TUpdate): Promise<TData> {
    const response = await this.axios.put<ApiResponse<TData>>(
      `${this.endpoint}/${id}`,
      data
    );
    return unwrapResponse(response);
  }

  /**
   * PATCH - Partial Update - Cập nhật một phần item
   * 
   * ⚠️ Lưu ý: Chỉ dùng cho các entity có endpoint dạng PATCH /{entity}/{id}.
   *    Nếu backend sử dụng đường dẫn khác (vd: /orders/{id}/status),
   *    hãy dùng apiService.custom() hoặc viết custom method thay vì patch().
   * 
   * @param id - ID của item
   * @param data - Partial update data
   * @returns Promise<TData>
   */
  async patch(id: string | number, data: Partial<TUpdate>): Promise<TData> {
    const response = await this.axios.patch<ApiResponse<TData>>(
      `${this.endpoint}/${id}`,
      data
    );
    return unwrapResponse(response);
  }

  /**
   * DELETE - Xóa item
   * Backend trả về ApiResponse<null> với data = null
   * 
   * @param id - ID của item
   * @returns Promise<void>
   */
  async delete(id: string | number): Promise<void> {
    const response = await this.axios.delete<ApiResponse<null>>(
      `${this.endpoint}/${id}`
    );
    if (response.isError) {
      throw new Error(response.message || 'Delete failed');
    }
  }

  /**
   * Custom method - Cho các endpoint đặc biệt
   * 
   * @param method - HTTP method
   * @param path - Path endpoint (relative hoặc absolute)
   * @param data - Request body (cho POST, PUT, PATCH)
   * @param params - Query parameters (camelCase) - sẽ được convert sang PascalCase
   * @returns Promise<TResponse>
   * 
   * @example
   * ```typescript
   * // Custom endpoint: PATCH /admin/orders/{id}/status
   * const order = await orderApiService.custom(
   *   'patch',
   *   `/admin/orders/${id}/status`,
   *   { status: 'paid' }
   * );
   * ```
   */
  async custom<TResponse = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    data?: any,
    params?: QueryParams
  ): Promise<TResponse> {
    const url = path.startsWith('/') ? path : `${this.endpoint}/${path}`;
    const pascalParams = params ? toPascalCaseParams(params) : undefined;
    const response = await this.axios.request<ApiResponse<TResponse>>({
      method,
      url,
      data,
      params: pascalParams,
    });
    return unwrapResponse(response);
  }
}

