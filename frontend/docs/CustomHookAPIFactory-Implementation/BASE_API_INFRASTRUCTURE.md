# Base API Infrastructure

## Tổng quan

Base API Infrastructure cung cấp các thành phần cơ bản, tái sử dụng cho tất cả features. Tất cả code nằm trong `src/lib/api/base/`.

## Cấu trúc Files

```
src/lib/api/base/
├── ApiServiceInterface.ts    # Interface contract cho mọi ApiService
├── BaseApiService.ts          # Base class với CRUD methods
├── apiResponseAdapter.ts      # unwrapResponse, handleApiError
└── index.ts                   # Export tất cả base utilities
```

## 1. ApiServiceInterface

**File**: `src/lib/api/base/ApiServiceInterface.ts`

**Mục đích**: Định nghĩa contract chung cho tất cả API services.

**Interface**:

```typescript
export interface ApiServiceInterface<TData, TCreate, TUpdate> {
  getAll(params?: Record<string, any>): Promise<TData[]>;
  getPaginated(params?: PagedRequest): Promise<PagedList<TData>>;
  getById(id: string | number): Promise<TData>;
  create(data: TCreate): Promise<TData>;
  update(id: string | number, data: TUpdate): Promise<TData>;
  patch(id: string | number, data: Partial<TUpdate>): Promise<TData>;
  delete(id: string | number): Promise<void>;
  custom<TResponse>(method, path, data?, params?): Promise<TResponse>;
}
```

**Sử dụng**: Tất cả ApiService classes phải implement interface này.

## 2. apiResponseAdapter

**File**: `src/lib/api/base/apiResponseAdapter.ts`

### unwrapResponse

**Mục đích**: Unwrap `ApiResponse<T>` về `T` và throw error nếu `isError === true`.

**Signature**:
```typescript
function unwrapResponse<T>(response: ApiResponse<T>): T
```

**Cách hoạt động**:
1. Kiểm tra `response.isError` hoặc `response.data == null`
2. Nếu có lỗi → throw `Error` với message từ response
3. Nếu thành công → return `response.data`

**Ví dụ**:
```typescript
const response = await axios.get<ApiResponse<Product[]>>('/api/products');
const products = unwrapResponse(response); // Product[] thay vì ApiResponse<Product[]>
```

### handleApiError

**Mục đích**: Chuẩn hóa error từ Axios/API về dạng `Error`.

**Signature**:
```typescript
function handleApiError(error: unknown): never
```

**Cách hoạt động**:
1. Kiểm tra nếu error đã là `Error` với message → throw lại
2. Nếu không → throw `Error` với message mặc định

## 3. BaseApiService

**File**: `src/lib/api/base/BaseApiService.ts`

**Mục đích**: Base class cung cấp CRUD operations chuẩn cho mọi entity.

### Constructor

```typescript
constructor(config: ApiConfig<TData, TCreate, TUpdate>)
```

**Config**:
- `endpoint: string` - API endpoint (ví dụ: `/admin/products`)
- `axiosInstance: AxiosInstance` - Axios instance (thường là `axiosClient`)

### Methods

#### getAll

```typescript
async getAll(params?: QueryParams): Promise<TData[]>
```

- GET danh sách không phân trang
- Query params được convert từ camelCase → PascalCase
- Trả về `TData[]` (đã unwrap từ `ApiResponse<TData[]>`)

#### getPaginated

```typescript
async getPaginated(params?: PagedRequest): Promise<PagedList<TData>>
```

- GET danh sách có phân trang
- Query params được convert từ camelCase → PascalCase
- Trả về `PagedList<TData>` với pagination metadata

#### getById

```typescript
async getById(id: string | number): Promise<TData>
```

- GET item theo ID
- Trả về `TData` (đã unwrap)

#### create

```typescript
async create(data: TCreate): Promise<TData>
```

- POST tạo mới item
- Trả về `TData` (item vừa tạo)

#### update

```typescript
async update(id: string | number, data: TUpdate): Promise<TData>
```

- PUT update toàn bộ item
- Trả về `TData` (item đã update)

#### patch

```typescript
async patch(id: string | number, data: Partial<TUpdate>): Promise<TData>
```

- PATCH partial update
- ⚠️ Chỉ dùng cho các entity có endpoint dạng `PATCH /{entity}/{id}`
- Nếu endpoint khác (vd: `/orders/{id}/status`), dùng `custom()` thay vì `patch()`

#### delete

```typescript
async delete(id: string | number): Promise<void>
```

- DELETE item
- Trả về `void`

#### custom

```typescript
async custom<TResponse>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  data?: any,
  params?: QueryParams
): Promise<TResponse>
```

- Custom endpoint cho các trường hợp đặc biệt
- `path` có thể là relative hoặc absolute
- Query params được convert từ camelCase → PascalCase

### Query Params Conversion

**Vấn đề**: Backend API sử dụng **PascalCase** cho query parameters (`Page`, `PageSize`, `Search`, etc.), nhưng TypeScript interfaces sử dụng **camelCase** (`page`, `pageSize`, `search`, etc.).

**Giải pháp**: `BaseApiService` tự động convert camelCase → PascalCase khi gọi API.

**Implementation**:
```typescript
function toPascalCaseParams(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      result[pascalKey] = value;
    }
  }
  return result;
}
```

**Ví dụ**:
```typescript
// Input (camelCase)
{ page: 1, pageSize: 20, categoryId: 1 }

// Output (PascalCase) - gửi lên backend
{ Page: 1, PageSize: 20, CategoryId: 1 }
```

## 4. Sử dụng BaseApiService

### Tạo Feature ApiService

```typescript
import { BaseApiService } from '../../../lib/api/base';
import axiosClient from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';
import type { ProductEntity } from '../types/entity';
import type { CreateProductRequest, UpdateProductRequest } from '../types/api';

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

  // Custom methods
  async searchByBarcode(barcode: string): Promise<ProductEntity[]> {
    return this.getAll({ search: barcode });
  }
}

// Export singleton
export const productApiService = new ProductApiService();
```

## Best Practices

1. **Luôn extend BaseApiService**: Không tạo ApiService từ đầu, luôn extend `BaseApiService`
2. **Sử dụng singleton pattern**: Export một instance duy nhất của ApiService
3. **Custom methods**: Thêm custom methods trong feature ApiService, không sửa `BaseApiService`
4. **Type safety**: Luôn specify generic types `<TData, TCreate, TUpdate>`
5. **Query params**: Sử dụng camelCase trong code, conversion tự động

## Troubleshooting

### Lỗi: "Cannot find module '@/lib/api/base'"

**Giải pháp**: Kiểm tra path alias trong `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Lỗi: "Query params không được gửi đúng"

**Nguyên nhân**: Backend yêu cầu PascalCase nhưng frontend gửi camelCase.

**Giải pháp**: `BaseApiService` đã tự động convert. Kiểm tra xem có đang dùng `BaseApiService` không.

### Lỗi: "ApiResponse wrapper không được unwrap"

**Nguyên nhân**: Không sử dụng `unwrapResponse` hoặc không dùng `BaseApiService`.

**Giải pháp**: Đảm bảo sử dụng `BaseApiService` methods, không gọi Axios trực tiếp.

