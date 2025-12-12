# Testing Guide - CustomHookAPIFactory

## Tổng quan

Hướng dẫn testing cho CustomHookAPIFactory, bao gồm unit tests, integration tests, và best practices.

## Setup Testing Environment

### Dependencies

```bash
yarn add -D @testing-library/react @testing-library/react-hooks @testing-library/jest-dom
```

### Test Setup

File: `src/test/setup.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Tạo QueryClient cho tests
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Không retry trong tests
        gcTime: 0,   // Không cache trong tests
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Test wrapper với QueryClientProvider
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

## Testing BaseApiService

### Mock Axios

```typescript
import axios from 'axios';
import { BaseApiService } from '@/lib/api/base';
import type { ApiResponse, PagedList } from '@/lib/api/types/api.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BaseApiService', () => {
  let apiService: BaseApiService<TestEntity, CreateTestRequest, UpdateTestRequest>;
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    apiService = new BaseApiService({
      endpoint: '/test',
      axiosInstance: mockAxiosInstance as any,
    });
  });

  describe('getAll', () => {
    it('should return data array', async () => {
      const mockResponse: ApiResponse<TestEntity[]> = {
        isError: false,
        message: 'Success',
        data: [{ id: 1, name: 'Test' }],
        timestamp: new Date().toISOString(),
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.getAll();

      expect(result).toEqual([{ id: 1, name: 'Test' }]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', { params: undefined });
    });

    it('should throw error when isError is true', async () => {
      const mockResponse: ApiResponse<TestEntity[]> = {
        isError: true,
        message: 'Error message',
        data: null,
        timestamp: new Date().toISOString(),
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await expect(apiService.getAll()).rejects.toThrow('Error message');
    });
  });

  describe('getPaginated', () => {
    it('should convert camelCase to PascalCase', async () => {
      const mockResponse: ApiResponse<PagedList<TestEntity>> = {
        isError: false,
        message: 'Success',
        data: {
          page: 1,
          pageSize: 20,
          totalCount: 100,
          totalPages: 5,
          hasPrevious: false,
          hasNext: true,
          items: [],
        },
        timestamp: new Date().toISOString(),
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiService.getPaginated({ page: 1, pageSize: 20 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        params: { Page: 1, PageSize: 20 },
      });
    });
  });
});
```

## Testing Hooks

### Testing useApiList

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useApiList } from '@/hooks/useApi';
import { TestWrapper } from '@/test/setup';
import { productApiService } from '@/features/products/api/ProductApiService';

jest.mock('@/features/products/api/ProductApiService');

describe('useApiList', () => {
  it('should fetch products list', async () => {
    const mockProducts = [
      { id: 1, productName: 'Product 1' },
      { id: 2, productName: 'Product 2' },
    ];

    (productApiService.getAll as jest.Mock).mockResolvedValue(mockProducts);

    const { result } = renderHook(
      () => useApiList({
        apiService: productApiService,
        entity: 'products',
      }),
      { wrapper: TestWrapper }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockProducts);
    expect(productApiService.getAll).toHaveBeenCalled();
  });
});
```

### Testing useApiCreate

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useApiCreate } from '@/hooks/useApi';
import { TestWrapper } from '@/test/setup';
import { productApiService } from '@/features/products/api/ProductApiService';

describe('useApiCreate', () => {
  it('should create product and invalidate cache', async () => {
    const mockProduct = { id: 1, productName: 'New Product' };
    (productApiService.create as jest.Mock).mockResolvedValue(mockProduct);

    const { result } = renderHook(
      () => useApiCreate({
        apiService: productApiService,
        entity: 'products',
      }),
      { wrapper: TestWrapper }
    );

    result.current.mutate({ productName: 'New Product', price: 100 });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProduct);
    expect(productApiService.create).toHaveBeenCalledWith({ productName: 'New Product', price: 100 });
  });
});
```

## Testing Pagination Hooks

### Testing usePaginationWithRouter

```typescript
import { renderHook } from '@testing-library/react';
import { usePaginationWithRouter } from '@/hooks/usePaginationWithRouter';
import { TestWrapper } from '@/test/setup';
import { productApiService } from '@/features/products/api/ProductApiService';

const mockRouteApi = {
  useSearch: jest.fn(() => ({
    page: 1,
    pageSize: 20,
    search: '',
  })),
};

describe('usePaginationWithRouter', () => {
  it('should initialize with URL params', () => {
    const { result } = renderHook(
      () => usePaginationWithRouter({
        apiService: productApiService,
        entity: 'products',
        routeApi: mockRouteApi,
      }),
      { wrapper: TestWrapper }
    );

    expect(result.current.params.page).toBe(1);
    expect(result.current.params.pageSize).toBe(20);
  });

  it('should handle filter changes', () => {
    const { result } = renderHook(
      () => usePaginationWithRouter({
        apiService: productApiService,
        entity: 'products',
        routeApi: mockRouteApi,
      }),
      { wrapper: TestWrapper }
    );

    // Test handleFilterChange
    result.current.handleFilterChange({ categoryId: 1 });
    // Verify navigate được gọi với params mới
  });
});
```

## Testing Components

### Testing Component với Hooks

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { ProductList } from '@/features/products/components/ProductList';
import { useProducts } from '@/features/products/hooks';
import { TestWrapper } from '@/test/setup';

jest.mock('@/features/products/hooks');

describe('ProductList', () => {
  it('should render products list', async () => {
    const mockProducts = [
      { id: 1, productName: 'Product 1' },
      { id: 2, productName: 'Product 2' },
    ];

    (useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    render(
      <TestWrapper>
        <ProductList />
      </TestWrapper>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useProducts as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(
      <TestWrapper>
        <ProductList />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Mock ApiService**: Luôn mock `apiService` methods trong tests
2. **Use TestWrapper**: Luôn wrap components với `TestWrapper` (QueryClientProvider)
3. **Test Error Cases**: Test cả success và error cases
4. **Test Cache Invalidation**: Verify cache được invalidate đúng cách
5. **Test Loading States**: Test `isLoading`, `isPending` states
6. **Test Query Keys**: Verify query keys được tạo đúng

## Common Test Patterns

### Pattern 1: Test Query Hook

```typescript
const { result } = renderHook(
  () => useApiList({ apiService, entity: 'test' }),
  { wrapper: TestWrapper }
);

await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});

expect(result.current.data).toEqual(expectedData);
```

### Pattern 2: Test Mutation Hook

```typescript
const { result } = renderHook(
  () => useApiCreate({ apiService, entity: 'test' }),
  { wrapper: TestWrapper }
);

result.current.mutate(mockData);

await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});

expect(result.current.data).toEqual(expectedData);
```

### Pattern 3: Test Component với Mocked Hooks

```typescript
jest.mock('@/features/products/hooks');

(useProducts as jest.Mock).mockReturnValue({
  data: mockProducts,
  isLoading: false,
});

render(<ProductList />);
```

## Troubleshooting

### Lỗi: "useQuery must be used within QueryClientProvider"

**Giải pháp**: Wrap component/hook với `TestWrapper`:
```typescript
render(
  <TestWrapper>
    <Component />
  </TestWrapper>
);
```

### Lỗi: "Cannot read property 'data' of undefined"

**Nguyên nhân**: Query chưa resolve.

**Giải pháp**: Sử dụng `waitFor`:
```typescript
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

### Mock không hoạt động

**Nguyên nhân**: Mock được setup sai hoặc không được import đúng.

**Giải pháp**: Kiểm tra mock setup:
```typescript
jest.mock('@/features/products/api/ProductApiService', () => ({
  productApiService: {
    getAll: jest.fn(),
  },
}));
```

