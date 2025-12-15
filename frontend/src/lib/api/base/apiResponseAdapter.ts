import type { ApiResponse } from '../types/api.types';

/**
 * Unwrap ApiResponse<T> về T và ném lỗi nếu isError === true hoặc data null.
 * Dùng chung cho BaseApiService và các chỗ cần xử lý ApiResponse thô.
 * 
 * @param response - ApiResponse từ backend
 * @returns Data thực tế (T) nếu thành công
 * @throws Error nếu isError === true hoặc data === null
 * 
 * @example
 * ```typescript
 * const response = await axios.get<ApiResponse<Product[]>>('/api/products');
 * const products = unwrapResponse(response); // Product[] thay vì ApiResponse<Product[]>
 * ```
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  console.log(`🔍 [unwrapResponse] Checking response:`, {
    isError: response.isError,
    data: response.data,
    message: response.message,
    statusCode: response.statusCode,
  });
  
  if (response.isError || response.data == null) {
    const error = new Error(response.message || 'API request failed') as Error & { responseData?: ApiResponse<T> };
    // Attach response data to error for debugging
    error.responseData = response;
    
    console.error(`❌ [unwrapResponse] Error detected:`, {
      message: error.message,
      responseData: response,
      error: error,
    });
    
    throw error;
  }
  
  console.log(`✅ [unwrapResponse] Successfully unwrapped:`, response.data);
  return response.data;
}

/**
 * Chuẩn hóa error từ Axios/API về dạng Error để upper layers dễ xử lý.
 * Có thể mở rộng sau này để map theo statusCode, validation errors, v.v.
 * 
 * @param error - Error từ Axios hoặc API
 * @throws Error với message rõ ràng
 * 
 * @example
 * ```typescript
 * try {
 *   await apiService.create(data);
 * } catch (error) {
 *   handleApiError(error); // Chuẩn hóa error
 * }
 * ```
 */
export function handleApiError(error: unknown): never {
  // Nếu error đã là Error và có message rõ ràng → ném lại
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  ) {
    throw error as Error;
  }

  // Fallback chung
  throw new Error('Unexpected API error');
}

