import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Định nghĩa types cho API response theo tài liệu đặc tả
export interface ApiResponse<T = never> {
  isError: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

// Định nghĩa interface cho login response
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    role: number; // 0: Admin, 1: Staff
  };
}

export interface PagedRequest {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortDesc?: boolean;
    categoryId?: number;
    supplierId?: number;
}

export interface PagedList<T> {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: T[];
}

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenUtils = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),

  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),

  clearAllTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

// Tạo Axios instance với cấu hình đầy đủ
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000, // 10 giây timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến để theo dõi việc refresh token đang diễn ra
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: never) => void;
}> = [];

// Xử lý queue khi refresh token hoàn thành
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - Tự động thêm token vào headers
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
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
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenUtils.getRefreshToken();

      if (refreshToken) {
        try {
          // Gọi API refresh token (sẽ implement sau khi có auth module)
          const response = await axios.post<ApiResponse<LoginResponse>>(
            `${axiosClient.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );

          if (!response.data.isError && response.data.data) {
            const newToken = response.data.data.token;
            tokenUtils.setToken(newToken);

            // Cập nhật header cho request gốc
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processQueue(null, newToken);

            return axiosClient(originalRequest);
          } else {
            throw new Error('Refresh token failed');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          tokenUtils.clearAllTokens();

          // Redirect về trang login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Không có refresh token, redirect về login
        tokenUtils.clearAllTokens();
        window.location.href = '/login';
        return Promise.reject(error);
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

