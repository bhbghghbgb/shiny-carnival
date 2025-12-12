# CustomHookAPIFactory Implementation Documentation

## Tổng quan

Tài liệu này mô tả quá trình triển khai hệ thống **CustomHookAPIFactory** cho frontend của dự án TapHoaNho. Hệ thống cung cấp một lớp trừu tượng thống nhất cho việc gọi API, dựa trên **Axios** và **TanStack Query**.

## Mục tiêu

- **DRY & Reusability**: Viết một lần cho CRUD + hooks, dùng cho mọi entity
- **Type-safe**: Dùng TypeScript generics từ tầng service đến hooks
- **Tách biệt concern**: Component UI không biết về `ApiResponse<T>`, chỉ làm việc với domain `T`
- **Tích hợp caching & state**: Tận dụng đầy đủ khả năng của TanStack Query
- **Mở rộng dễ dàng**: Mỗi feature có thể extend `BaseApiService` và tạo hooks wrapper riêng

## Cấu trúc tài liệu

1. **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Kế hoạch triển khai chi tiết
2. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Hướng dẫn setup TanStack Query và dependencies
3. **[BASE_API_INFRASTRUCTURE.md](./BASE_API_INFRASTRUCTURE.md)** - Tài liệu về BaseApiService, ApiServiceInterface, apiResponseAdapter
4. **[UNIVERSAL_HOOKS.md](./UNIVERSAL_HOOKS.md)** - Tài liệu về useApi.ts và các universal hooks
5. **[PAGINATION_HOOKS.md](./PAGINATION_HOOKS.md)** - Tài liệu về usePaginationWithRouter và usePaginationLocal
6. **[PRODUCTS_MIGRATION_EXAMPLE.md](./PRODUCTS_MIGRATION_EXAMPLE.md)** - Ví dụ migration Products feature
7. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Hướng dẫn migrate từ code cũ sang pattern mới
8. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Hướng dẫn testing cho hooks và services
9. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues và solutions
10. **[RESEARCH_SUMMARY.md](./RESEARCH_SUMMARY.md)** - Tóm tắt research về TanStack Query và Axios patterns

## Quick Start

### 1. Setup Dependencies

```bash
cd frontend
yarn add @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Sử dụng trong Component

```typescript
import { useProducts } from '@/features/products/hooks';

function ProductList() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.productName}</div>
      ))}
    </div>
  );
}
```

## Kiến trúc

Hệ thống tuân theo **Feature-Sliced Design (FSD)** với 3 layers:

1. **Base Infrastructure** (`src/lib/api/base/`)
   - `ApiServiceInterface` - Contract cho mọi API service
   - `BaseApiService` - Base class với CRUD methods
   - `apiResponseAdapter` - Xử lý `ApiResponse<T>` wrapper

2. **Universal Hooks** (`src/hooks/`)
   - `useApi.ts` - Universal CRUD hooks
   - `usePaginationWithRouter.ts` - URL-based pagination
   - `usePaginationLocal.ts` - Local state pagination

3. **Feature Extensions** (`src/features/[entity]/`)
   - `api/[Entity]ApiService.ts` - Extends BaseApiService
   - `hooks/use[Entity]s.ts` - Feature-specific hooks

## Tham khảo

- [CustomHookAPIFactory-Architectured.md](../../../TapHoaNho-Docuement/CustomHook/CustomHookAPIFactory-Architectured.md) - Tài liệu kiến trúc chi tiết
- [CustomHookAPIFactory.md](../../../TapHoaNho-Docuement/CustomHook/CustomHookAPIFactory.md) - Tài liệu implementation examples
- [BACKEND_API_REFERENCE.md](../../../TapHoaNho-Docuement/api/BACKEND_API_REFERENCE.md) - Tài liệu API backend

