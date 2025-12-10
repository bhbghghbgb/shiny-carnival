import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { LoginResponse } from "../features/auth/types/api.ts";
import { ENDPOINTS } from "../app/routes/type/routes.endpoint.ts";
import { API_CONFIG } from "../config/api.config";
import type { ApiResponse } from './api/types/api.types';

// CSRF Token management
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

/**
 * Lấy CSRF token từ server
 */
async function getCsrfToken(): Promise<string> {
  // Nếu đã có token, trả về ngay
  if (csrfToken) {
    return csrfToken;
  }

  // Nếu đang có request lấy token, đợi request đó
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  // Tạo request mới để lấy token
  csrfTokenPromise = axios
    .get<{ csrfToken: string }>(`${axiosClient.defaults.baseURL}${API_CONFIG.ENDPOINTS.AUTH.CSRF_TOKEN}`, {
      withCredentials: true
    })
    .then(response => {
      csrfToken = response.data.csrfToken;
      csrfTokenPromise = null;
      return csrfToken;
    })
    .catch(error => {
      csrfTokenPromise = null;
      throw error;
    });

  return csrfTokenPromise;
}

/**
 * Reset CSRF token (dùng khi logout hoặc token hết hạn)
 */
export function resetCsrfToken(): void {
  csrfToken = null;
  csrfTokenPromise = null;
}

// TokenUtils không còn cần thiết vì tokens được lưu trong httpOnly cookies
// Giữ lại để tương thích với code cũ, nhưng không thực hiện gì
export const tokenUtils = {
  getToken: (): string | null => null, // Tokens trong cookies, không thể đọc từ JS
  setToken: (): void => { /* Tokens được set bởi backend qua cookies */ },
  removeToken: (): void => { /* Cookies được xóa bởi backend */ },

  getRefreshToken: (): string | null => null, // Tokens trong cookies, không thể đọc từ JS
  setRefreshToken: (): void => { /* Tokens được set bởi backend qua cookies */ },
  removeRefreshToken: (): void => { /* Cookies được xóa bởi backend */ },

  clearAllTokens: (): void => { /* Cookies được xóa bởi backend khi logout */ }
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

// Request interceptor - Thêm CSRF token vào headers
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Đảm bảo withCredentials luôn được set
    config.withCredentials = true;

    // Chỉ thêm CSRF token cho các method không phải GET, HEAD, OPTIONS
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      try {
        const token = await getCsrfToken();
        config.headers['X-CSRF-TOKEN'] = token;
      } catch (error) {
        // Nếu không lấy được CSRF token, vẫn tiếp tục request
        // Backend sẽ trả về lỗi nếu cần
        console.warn('Failed to get CSRF token:', error);
      }
    }

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
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Không cần set header vì backend đọc từ cookie
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token - backend sẽ đọc refresh token từ cookie tự động
        // Không cần gửi tokens trong body vì đã có trong cookies
        const response = await axios.post<ApiResponse<LoginResponse>>(
          `${axiosClient.defaults.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
          {}, // Empty body - backend đọc từ cookies
          {
            withCredentials: true // Đảm bảo gửi cookies
          }
        );

        if (!response.data.isError && response.data.data) {
          // Tokens mới đã được set vào cookies bởi backend
          // Không cần lưu vào localStorage nữa

          processQueue(null, null); // Không cần token vì backend đọc từ cookie

          // Retry request gốc - cookies mới sẽ tự động được gửi
          return axiosClient(originalRequest);
        } else {
          throw new Error('Refresh token failed');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Reset CSRF token khi refresh thất bại
        resetCsrfToken();

        // Redirect về trang login
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

