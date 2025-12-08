import type { PagedList, PagedRequest } from '../../types/api.types';

/**
 * ApiServiceInterface - Contract chung cho tất cả API services
 *
 * Mục tiêu:
 * - Chuẩn hóa signature cho CRUD + pagination + custom endpoints
 * - Cho phép BaseApiService và các service khác implement một cách nhất quán
 * 
 * @template TData - Type của entity data
 * @template TCreate - Type của create request
 * @template TUpdate - Type của update request
 */
export interface ApiServiceInterface<TData = any, TCreate = any, TUpdate = any> {
  // GET all (không phân trang hoặc có params filter đơn giản)
  getAll(params?: Record<string, any>): Promise<TData[]>;

  // GET với phân trang chuẩn PagedRequest → PagedList<TData>
  getPaginated(params?: PagedRequest): Promise<PagedList<TData>>;

  // GET by ID
  getById(id: string | number): Promise<TData>;

  // POST - Create
  create(data: TCreate): Promise<TData>;

  // PUT - Full update
  update(id: string | number, data: TUpdate): Promise<TData>;

  // PATCH - Partial update (chỉ một số entity/endpoint hỗ trợ)
  patch(id: string | number, data: Partial<TUpdate>): Promise<TData>;

  // DELETE
  delete(id: string | number): Promise<void>;

  // Custom endpoint cho các trường hợp đặc biệt
  custom<TResponse = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<TResponse>;
}

