# Setup Guide - CustomHookAPIFactory

## Yêu cầu

- Node.js >= 18
- Yarn >= 4.10.3
- TypeScript >= 5.9.3
- React >= 19.1.1

## Bước 1: Cài đặt Dependencies

### TanStack Query

```bash
cd frontend
yarn add @tanstack/react-query @tanstack/react-query-devtools
```

**Versions đã cài đặt**:
- `@tanstack/react-query`: `^5.90.12`
- `@tanstack/react-query-devtools`: `^5.91.1`

## Bước 2: Tạo QueryClient Instance

File: `src/lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 phút
      gcTime: 10 * 60 * 1000, // 10 phút
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0, // Không retry mutations
    },
  },
});
```

## Bước 3: Setup QueryClientProvider

File: `src/app/main.tsx`

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../lib/queryClient';

// Wrap app với QueryClientProvider
<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
</QueryClientProvider>
```

## Bước 4: Verify Setup

### Kiểm tra QueryClient hoạt động

Tạo một test component:

```typescript
import { useQuery } from '@tanstack/react-query';

function TestComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: () => Promise.resolve('Hello World'),
  });

  return <div>{isLoading ? 'Loading...' : data}</div>;
}
```

### Kiểm tra ReactQueryDevtools

1. Chạy dev server: `yarn dev`
2. Mở browser console
3. Tìm icon React Query Devtools (thường ở góc dưới bên phải)
4. Click để mở Devtools panel

## Configuration Options

### QueryClient Default Options

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,        // Data fresh trong 5 phút
    gcTime: 10 * 60 * 1000,           // Giữ cache 10 phút
    retry: 1,                          // Retry 1 lần khi fail
    refetchOnWindowFocus: false,       // Không refetch khi focus window
    refetchOnReconnect: true,          // Refetch khi reconnect
  },
  mutations: {
    retry: 0,                          // Không retry mutations
  },
}
```

### Tùy chỉnh cho từng Query

Có thể override default options trong từng hook:

```typescript
const { data } = useProducts({
  options: {
    staleTime: 1000 * 60 * 10, // 10 phút cho products
    retry: 3,                  // Retry 3 lần
  },
});
```

## Troubleshooting

### Lỗi: "useQuery must be used within QueryClientProvider"

**Nguyên nhân**: Component sử dụng hooks nằm ngoài `QueryClientProvider`.

**Giải pháp**: Đảm bảo `QueryClientProvider` wrap toàn bộ app trong `main.tsx`.

### Lỗi: "Cannot find module '@tanstack/react-query'"

**Nguyên nhân**: Dependencies chưa được cài đặt.

**Giải pháp**: 
```bash
yarn install
```

### ReactQueryDevtools không hiển thị

**Nguyên nhân**: Chỉ hiển thị trong development mode.

**Giải pháp**: Kiểm tra `import.meta.env.DEV` hoặc `process.env.NODE_ENV === 'development'`.

## Next Steps

Sau khi setup xong:
1. Xem [BASE_API_INFRASTRUCTURE.md](./BASE_API_INFRASTRUCTURE.md) để hiểu Base API layer
2. Xem [UNIVERSAL_HOOKS.md](./UNIVERSAL_HOOKS.md) để hiểu cách sử dụng hooks
3. Xem [PRODUCTS_MIGRATION_EXAMPLE.md](./PRODUCTS_MIGRATION_EXAMPLE.md) để xem ví dụ migration

