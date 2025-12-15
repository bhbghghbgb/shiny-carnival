// Định nghĩa types cho API response theo tài liệu đặc tả
export interface ApiResponse<T = never> {
  isError: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface PagedRequest {
  page: number; //page index
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
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

