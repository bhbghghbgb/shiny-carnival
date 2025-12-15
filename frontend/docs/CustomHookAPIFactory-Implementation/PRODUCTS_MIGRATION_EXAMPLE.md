# Products Feature Migration Example

## Tổng quan

Tài liệu này mô tả quá trình migrate Products feature từ code cũ sang CustomHookAPIFactory pattern.

## Before: Code cũ

### API Functions (productApi.ts)

```typescript
// ❌ Code cũ - Manual API calls
export const productApi = {
  getProducts: async (params?: PagedRequest): Promise<ApiResponse<PagedList<ProductEntity>>> => {
    try {
      const response = await axiosClient.get<ApiResponse<PagedList<ProductEntity>>>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw {
        isError: true,
        message: error.message || 'Không thể lấy danh sách sản phẩm',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  getProductById: async (id: number): Promise<ApiResponse<ProductEntity>> => {
    // ... manual implementation
  },
  
  createProduct: async (data: CreateProductRequest): Promise<ApiResponse<ProductEntity>> => {
    // ... manual implementation
  },
  // ... nhiều methods khác
};
```

### Component sử dụng

```typescript
// ❌ Code cũ - Manual state management
function ProductList() {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productApi.getProducts();
        if (!response.isError && response.data) {
          setProducts(response.data.items);
        } else {
          setError(new Error(response.message));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.productName}</div>
      ))}
    </div>
  );
}
```

**Vấn đề**:
- ❌ Code lặp lại ở mọi component
- ❌ Phải xử lý `ApiResponse<T>` wrapper thủ công
- ❌ Không có caching
- ❌ Phải quản lý loading/error state thủ công
- ❌ Không có automatic refetching

## After: Code mới

### ProductApiService

```typescript
// ✅ Code mới - Extends BaseApiService
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

  async getProductsByCategory(
    categoryId: number,
    params?: Omit<PagedRequest, 'categoryId'>
  ): Promise<PagedList<ProductEntity>> {
    return this.getPaginated({
      ...params,
      categoryId,
    } as PagedRequest);
  }
}

export const productApiService = new ProductApiService();
```

### Hooks Wrapper

```typescript
// ✅ Code mới - Feature-level hooks
import { useApiList, useApiDetail, useApiCreate } from '../../../hooks/useApi';
import { productApiService } from '../api/ProductApiService';

export const useProducts = (params?: Record<string, unknown>) => {
  return useApiList<ProductEntity>({
    apiService: productApiService,
    entity: 'products',
    params,
  });
};

export const useProduct = (id: string | number) => {
  return useApiDetail<ProductEntity>({
    apiService: productApiService,
    entity: 'products',
    id,
  });
};

export const useCreateProduct = () => {
  return useApiCreate<ProductEntity, CreateProductRequest>({
    apiService: productApiService,
    entity: 'products',
  });
};
```

### Component sử dụng

```typescript
// ✅ Code mới - Sử dụng hooks
import { useProducts, useCreateProduct } from '@/features/products/hooks';

function ProductList() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.productName}</div>
      ))}
    </div>
  );
}
```

**Lợi ích**:
- ✅ Code ngắn gọn, dễ đọc
- ✅ Tự động xử lý `ApiResponse<T>` wrapper
- ✅ Có caching tự động
- ✅ Loading/error state được quản lý tự động
- ✅ Automatic refetching khi cần

## Step-by-Step Migration

### Bước 1: Tạo ProductApiService

1. Tạo file `src/features/products/api/ProductApiService.ts`
2. Extend `BaseApiService` với generic types
3. Thêm custom methods nếu cần
4. Export singleton instance

### Bước 2: Tạo Hooks Wrapper

1. Tạo file `src/features/products/hooks/useProducts.ts`
2. Import universal hooks từ `@/hooks/useApi`
3. Wrap với `productApiService` và `entity: 'products'`
4. Export tất cả hooks

### Bước 3: Migrate Components

1. Thay thế manual API calls bằng hooks
2. Xóa `useState` và `useEffect` cho data fetching
3. Sử dụng `data`, `isLoading`, `error` từ hooks
4. Sử dụng `mutate` cho mutations

### Bước 4: Cleanup

1. Xóa file API cũ (hoặc giữ lại để tương thích ngược)
2. Update imports trong tất cả components
3. Test toàn bộ functionality

## Migration Checklist

### ProductApiService
- [x] Tạo `ProductApiService` extends `BaseApiService`
- [x] Setup endpoint và axios instance
- [x] Thêm custom methods (nếu có)
- [x] Export singleton instance

### Hooks
- [x] `useProducts` - GET all
- [x] `useProductsPaginated` - GET paginated
- [x] `useProduct` - GET by ID
- [x] `useCreateProduct` - POST create
- [x] `useUpdateProduct` - PUT update
- [x] `usePatchProduct` - PATCH partial update
- [x] `useDeleteProduct` - DELETE
- [x] `useProductsByCategory` - Custom query
- [x] `useProductsBySupplier` - Custom query
- [x] `useProductsByBarcode` - Custom query
- [x] `useProductsWithRouter` - Pagination với URL sync
- [x] `useProductsLocal` - Pagination với local state

### Components Migration
- [ ] Migrate ProductList component
- [ ] Migrate ProductDetail component
- [ ] Migrate ProductForm component
- [ ] Migrate ProductSelectionModal component
- [ ] Test tất cả functionality

## Code Comparison

### GET Products

**Before**:
```typescript
const [products, setProducts] = useState<ProductEntity[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getProducts();
      if (!response.isError && response.data) {
        setProducts(response.data.items);
      }
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);
```

**After**:
```typescript
const { data: products, isLoading } = useProducts();
```

### CREATE Product

**Before**:
```typescript
const [creating, setCreating] = useState(false);

const handleCreate = async (formData: CreateProductRequest) => {
  setCreating(true);
  try {
    const response = await productApi.createProduct(formData);
    if (!response.isError && response.data) {
      toast.success('Created!');
      // refetch products manually
      await fetchProducts();
    }
  } catch (err) {
    toast.error('Failed!');
  } finally {
    setCreating(false);
  }
};
```

**After**:
```typescript
const createProduct = useCreateProduct({
  options: {
    onSuccess: () => {
      toast.success('Created!');
      // Cache tự động invalidate, không cần refetch thủ công
    },
    onError: () => {
      toast.error('Failed!');
    },
  },
});

const handleCreate = (formData: CreateProductRequest) => {
  createProduct.mutate(formData);
};
```

## Best Practices

1. **Migrate từng component một**: Không migrate tất cả cùng lúc
2. **Test sau mỗi migration**: Đảm bảo functionality vẫn hoạt động
3. **Giữ code cũ tạm thời**: Để rollback nếu cần
4. **Update imports**: Đảm bảo tất cả imports đúng
5. **Remove unused code**: Xóa code cũ sau khi đã migrate xong

## Troubleshooting

### Component không refetch sau khi create

**Nguyên nhân**: Cache không được invalidate.

**Giải pháp**: Sử dụng `useApiCreate` với `invalidateQueries` nếu cần:
```typescript
const createProduct = useCreateProduct({
  invalidateQueries: ['categories', 'stats'], // Invalidate thêm queries liên quan
});
```

### Type errors khi migrate

**Nguyên nhân**: Types không khớp giữa code cũ và mới.

**Giải pháp**: Kiểm tra types trong `entity.ts` và `api.ts`:
```typescript
// Đảm bảo types đúng
export interface ProductEntity { ... }
export interface CreateProductRequest { ... }
export type UpdateProductRequest = ProductEntity
```

