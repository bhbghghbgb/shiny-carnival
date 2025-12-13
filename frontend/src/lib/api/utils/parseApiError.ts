/**
 * Utility function để parse error message từ ApiResponse hoặc các format khác
 * 
 * Backend có thể trả về:
 * 1. ApiResponse<T> với isError === true và message
 * 2. ProblemDetails (application/problem+json) với title và detail
 * 3. Validation errors với errors dictionary
 * 4. String message
 * 
 * @param error - Error object từ Axios hoặc mutation
 * @returns Error message string rõ ràng
 */
export function parseApiError(error: unknown): string {
  // Nếu error đã là string
  if (typeof error === 'string') {
    return error;
  }

  // Nếu error là Error instance với message đã được set từ interceptor
  if (error instanceof Error && error.message && error.message !== 'Có lỗi xảy ra') {
    // Check for common database errors and provide user-friendly messages
    const message = error.message;
    
    // Database constraint violations
    if (message.includes('duplicate key') || message.includes('unique constraint')) {
      if (message.includes('PK_')) {
        return 'Lỗi database: Không thể tạo mới. Vui lòng thử lại hoặc liên hệ quản trị viên.';
      }
      return 'Dữ liệu đã tồn tại trong hệ thống. Vui lòng kiểm tra lại.';
    }
    
    // Generic database errors
    if (message.includes('saving the entity changes') || message.includes('database')) {
      return 'Lỗi khi lưu dữ liệu. Vui lòng thử lại hoặc liên hệ quản trị viên.';
    }
    
    return message;
  }

  // Kiểm tra nếu error là object
  if (error && typeof error === 'object') {
    const err = error as any;

    // Ưu tiên 1: Message từ interceptor (đã được parse từ ApiResponse)
    if (err.message && typeof err.message === 'string' && err.message !== 'Có lỗi xảy ra') {
      return err.message;
    }

    // Ưu tiên 2: ApiResponse format trực tiếp từ response.data
    if (err.isError === true && err.message) {
      return err.message;
    }

    // Ưu tiên 3: response.data.isError (từ AxiosError)
    if (err.response?.data?.isError === true && err.response.data.message) {
      return err.response.data.message;
    }

    // Ưu tiên 4: response.data.message (ApiResponse nhưng không có isError flag)
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    // Ưu tiên 5: ProblemDetails format (title + detail)
    if (err.response?.data?.title) {
      let msg = err.response.data.title;
      if (err.response.data.detail) {
        msg += `: ${err.response.data.detail}`;
      }
      return msg;
    }

    // Ưu tiên 6: ProblemDetails detail only
    if (err.response?.data?.detail) {
      return err.response.data.detail;
    }

    // Ưu tiên 7: Validation errors (FluentValidation)
    if (err.response?.data?.errors) {
      const validationMessages = Object.values(err.response.data.errors as Record<string, string[]>)
        .flat()
        .join('; ');
      if (validationMessages) {
        return validationMessages;
      }
    }

    // Ưu tiên 8: data.message (từ interceptor)
    if (err.data?.message) {
      return err.data.message;
    }

    // Ưu tiên 9: originalError (từ interceptor)
    if (err.originalError?.response?.data?.isError === true && err.originalError.response.data.message) {
      return err.originalError.response.data.message;
    }
    if (err.originalError?.response?.data?.message) {
      return err.originalError.response.data.message;
    }

    // Ưu tiên 10: Error instance message
    if (err instanceof Error && err.message) {
      return err.message;
    }
  }

  // Fallback
  return 'Đã có lỗi xảy ra, vui lòng thử lại.';
}

