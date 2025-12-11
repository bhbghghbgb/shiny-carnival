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
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

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

    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔐 Access token hết hạn, bắt đầu refresh token...');
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
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
        processQueue(refreshError, null);

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
      // Trả về error message từ API response
      return Promise.reject({
        ...error,
        message: error.response.data.message || 'Có lỗi xảy ra',
        data: error.response.data
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

