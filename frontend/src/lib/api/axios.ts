import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { LoginResponse } from "../../features/auth/types/api.ts";
import { ENDPOINTS } from "../../app/routes/type/routes.endpoint.ts";
import { API_CONFIG } from "../../config/api.config.ts";
import type { ApiResponse } from './types/api.types.ts';
import { useAuthStore } from "../../features/auth/store/authStore.ts";

// Token utils không còn dùng do BE đọc cookie trực tiếp
export const tokenUtils = {
  getToken: (): string | null => null,
  getRefreshToken: (): string | null => null,
  setTokens: (): void => { /* no-op */ },
  clearAllTokens: (): void => { /* no-op */ }
};

// Tạo Axios instance với cấu hình đầy đủ
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5175',
  timeout: 10000, // 10 giây timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng: Cho phép gửi cookies với mọi request
});

// Biến để theo dõi việc refresh token đang diễn ra
let isRefreshing = false;
let isRedirecting = false; // Flag để theo dõi việc đang redirect đến login
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Kiểm tra xem có đang ở trang login không
const isLoginPage = (): boolean => {
  return window.location.pathname === ENDPOINTS.AUTH.LOGIN || 
         window.location.pathname.startsWith(ENDPOINTS.AUTH.ROOT);
};

// Kiểm tra xem request có phải là auth endpoint không (login, register, refresh, logout, etc.)
const isAuthEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  const authEndpoints = [
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    API_CONFIG.ENDPOINTS.AUTH.REFRESH,
    API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
    API_CONFIG.ENDPOINTS.AUTH.SETUP_ADMIN,
  ];
  return authEndpoints.some(endpoint => url.includes(endpoint));
};

// Xử lý queue khi refresh token hoàn thành
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Đảm bảo withCredentials luôn được set
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Nếu đang redirect, chặn tất cả request (trừ auth endpoints)
    if (isRedirecting) {
      // Cho phép auth endpoints ngay cả khi đang redirect
      if (isAuthEndpoint(config.url)) {
        config.withCredentials = true;
        return config;
      }
      // Tạo một error object với flag để các component có thể handle
      const error = new Error('Đang chuyển hướng đến trang đăng nhập') as Error & { 
        isRedirecting?: boolean;
        skipLogging?: boolean;
      };
      error.isRedirecting = true;
      error.skipLogging = false; // Tắt skipLogging để xem lỗi chi tiết
      return Promise.reject(error);
    }

    // Nếu đang ở trang login, chỉ cho phép auth endpoints
    // Chặn các request khác để tránh vòng lặp redirect
    if (isLoginPage()) {
      if (isAuthEndpoint(config.url)) {
        // Cho phép auth endpoints (login, register, refresh, etc.)
        config.withCredentials = true;
        return config;
      }
      // Chặn các request khác khi đang ở trang login
      const error = new Error('Đang ở trang đăng nhập, chỉ cho phép các request xác thực') as Error & { 
        isRedirecting?: boolean;
        skipLogging?: boolean;
      };
      error.skipLogging = false; // Tắt skipLogging để xem lỗi chi tiết
      return Promise.reject(error);
    }

    // Đảm bảo withCredentials luôn được set để gửi cookies
    config.withCredentials = true;
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và error handling
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về data từ ApiResponse structure
    return response.data as never;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bỏ qua xử lý 401 nếu đang redirect hoặc đang ở trang login
    // để tránh vòng lặp redirect vô hạn
    if (isRedirecting || isLoginPage()) {
      return Promise.reject(error);
    }

    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Bỏ qua refresh token nếu request là đến endpoint refresh token
      // để tránh vòng lặp
      if (originalRequest.url?.includes(API_CONFIG.ENDPOINTS.AUTH.REFRESH)) {
        return Promise.reject(error);
      }

      console.log('🔐 Access token hết hạn, bắt đầu refresh token...');
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Kiểm tra lại trước khi retry
          if (isRedirecting || isLoginPage()) {
            return Promise.reject(new Error('Đang chuyển hướng đến trang đăng nhập'));
          }
          originalRequest.withCredentials = true;
          // Reset _retry flag để có thể retry lại nếu cần
          originalRequest._retry = false;
          // Request sẽ được retry với cookies mới
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Clear auth state trước khi refresh token
      useAuthStore.getState().clearAuth();

      try {
        // Backend đọc refresh token từ HttpOnly cookie
        const response = await axiosClient.post<ApiResponse<LoginResponse>>(
          API_CONFIG.ENDPOINTS.AUTH.REFRESH,
          {}
        ) as unknown as ApiResponse<LoginResponse>;

        if (!response.isError && response.data) {
          // Tokens mới đã được set vào cookies bởi backend

          console.log('✅ Refresh token thành công, cookies mới đã được set');

          // Đợi một chút để đảm bảo cookies được set trong browser
          await new Promise(resolve => setTimeout(resolve, 100));

          processQueue(null, null);

          // Kiểm tra lại trước khi retry
          if (isRedirecting || isLoginPage()) {
            return Promise.reject(new Error('Đang chuyển hướng đến trang đăng nhập'));
          }

          // Retry request gốc - cookies mới sẽ tự động được gửi
          // Đảm bảo withCredentials được set
          originalRequest.withCredentials = true;
          // Reset _retry flag để có thể retry lại nếu cần
          originalRequest._retry = false;
          console.log('🔄 Retrying original request với cookies mới...', {
            method: originalRequest.method,
            url: originalRequest.url,
            hasData: !!originalRequest.data,
            hasParams: !!originalRequest.params
          });
          return axiosClient(originalRequest);
        } else {
          console.error('❌ Refresh token failed:', response.message);
          throw new Error(response.message || 'Refresh token failed');
        }
      } catch (refreshError) {
        console.error('❌ Refresh token error:', refreshError);
        
        // Set flag redirecting trước khi redirect
        isRedirecting = true;
        
        // Reject tất cả các request trong queue
        processQueue(new Error('Refresh token thất bại, đang chuyển hướng đến trang đăng nhập'), null);

        // Redirect về trang login
        console.log('🔄 Redirecting to login page...');
        window.location.href = ENDPOINTS.AUTH.LOGIN;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý các lỗi khác
    if (error.response?.data) {
      // Backend có thể trả về ApiResponse hoặc ProblemDetails (application/problem+json) hoặc validation errors
      const responseData = error.response.data as any;

      // Log error chi tiết (luôn log để debug, nhưng đánh dấu nếu có skipLogging)
      const errorWithSkipLogging = error as unknown as { skipLogging?: boolean };
      const logPrefix = errorWithSkipLogging.skipLogging ? '⚠️ [Axios] API Error (skipLogging=true):' : '❌ [Axios] API Error:';
      console.error(logPrefix, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: responseData,
        headers: error.response?.headers,
        skipLogging: errorWithSkipLogging.skipLogging || false,
      });

      // Lấy message từ nhiều nguồn có thể
      let errorMessage = 'Có lỗi xảy ra';

      // Ưu tiên 1: ApiResponse format từ backend (isError === true)
      if (responseData.isError === true && responseData.message) {
        errorMessage = responseData.message;
      }
      // Ưu tiên 2: ApiResponse format nhưng không có isError flag (fallback)
      else if (responseData.message && typeof responseData.message === 'string') {
        errorMessage = responseData.message;
      }
      // Ưu tiên 3: ProblemDetails format (application/problem+json)
      else if (responseData.title) {
        errorMessage = responseData.title;
        if (responseData.detail) {
          errorMessage += `: ${responseData.detail}`;
        }
      }
      // Ưu tiên 4: Detail không có title
      else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      // Ưu tiên 5: Validation errors (FluentValidation format)
      else if (responseData.errors) {
        const validationMessages = Object.values(responseData.errors as Record<string, string[]>)
          .flat()
          .join('; ');
        if (validationMessages) {
          errorMessage = validationMessages;
        }
      }
      // Ưu tiên 6: String response
      else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }

      // Trả về error message từ API response
      return Promise.reject({
        ...error,
        message: errorMessage,
        data: responseData,
        originalError: error, // Giữ lại error gốc để debug
      });
    }

    // Xử lý lỗi network hoặc timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        ...error,
        message: 'Yêu cầu bị timeout. Vui lòng thử lại.'
      });
    }

    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

