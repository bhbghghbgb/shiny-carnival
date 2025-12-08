# Pagination Hooks Documentation

## Tổng quan

Hệ thống cung cấp 3 hooks cho pagination, mỗi hook phù hợp với use case khác nhau:

1. **`useApiPaginated`** - Core hook (data fetching only)
2. **`usePaginationWithRouter`** - URL-based pagination cho Page components
3. **`usePaginationLocal`** - Local state pagination cho Modal/Drawer

## Decision Tree

```
Có router context?
├─ YES → Page component?
│   ├─ YES → usePaginationWithRouter ✅
│   └─ NO → useApiPaginated (custom logic)
│
└─ NO → Modal/Drawer?
    ├─ YES → usePaginationLocal ✅
    └─ NO → Nhận params từ props?
        ├─ YES → useApiPaginated ✅
        └─ NO → usePaginationLocal ✅
```

## 1. useApiPaginated (Core Hook)

**File**: `src/hooks/useApi.ts`

**Mục đích**: Core hook chỉ lo việc fetch data. Không quản lý state, nhận `params` từ bên ngoài.

**Khi nào dùng**:
- ✅ Nested components nhận params từ props
- ✅ Custom pagination logic phức tạp
- ✅ Cần full control over state management

**Ví dụ**:
```typescript
// Pattern 1: Với TanStack Router (URL state)
function ProductListPage() {
  const routeApi = getRouteApi('/admin/products');
  const navigate = useNavigate();
  const search = routeApi.useSearch();
  
  const params: PagedRequest = {
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 20,
    search: search.search,
  };

  const { data, isLoading } = useApiPaginated<ProductEntity>({
    apiService: productApiService,
    entity: 'products',
    params,
  });

  const handlePageChange = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  return <Table dataSource={data?.items} pagination={{ current: data?.page, onChange: handlePageChange }} />;
}

// Pattern 2: Nested component nhận params từ props
function ProductTable({ params, onPageChange }: { params: PagedRequest; onPageChange: (page: number) => void }) {
  const { data } = useApiPaginated<ProductEntity>({
    apiService: productApiService,
    entity: 'products',
    params, // Nhận từ parent
  });

  return <Table dataSource={data?.items} pagination={{ current: data?.page, onChange: onPageChange }} />;
}
```

## 2. usePaginationWithRouter

**File**: `src/hooks/usePaginationWithRouter.ts`

**Mục đích**: URL-based pagination cho Page components. Tự động sync với URL query params.

**Khi nào dùng**:
- ✅ Page components có router context
- ✅ Cần URL sync (deep linking, shareable URLs, browser back/forward)
- ✅ SEO friendly pagination
- ❌ KHÔNG dùng trong Modal/Drawer (không có router context)

### API

**Config**:
```typescript
{
  apiService: BaseApiService<TData>;
  entity: string;
  routeApi: { useSearch: () => Record<string, unknown> };
  additionalParams?: QueryParams;
}
```

**Returns**:
```typescript
{
  // Query state
  data: PagedList<TData> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Pagination data
  params: PagedRequest & QueryParams;
  items: TData[];
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  
  // Filters
  filters: QueryParams;
  activeFiltersCount: number;
  
  // Handlers
  handlePageChange: (page: number, pageSize?: number) => void;
  handleSearch: (searchText: string) => void;
  handleSort: (field: string, descending: boolean) => void;
  handleFilterChange: (filters: QueryParams) => void;
  clearFilters: (filterKeys?: string[]) => void;
  resetPagination: () => void;
}
```

### Ví dụ sử dụng

```typescript
import { getRouteApi } from '@tanstack/react-router';
import { useProductsWithRouter } from '@/features/products/hooks';

const routeApi = getRouteApi('/admin/products');

export function ProductListPage() {
  const pagination = useProductsWithRouter({ routeApi });

  return (
    <div>
      {/* Search */}
      <Input.Search
        defaultValue={pagination.params.search}
        onSearch={pagination.handleSearch}
        allowClear
      />

      {/* Filters */}
      <Select
        value={pagination.filters.categoryId}
        onChange={(value) => pagination.handleFilterChange({ categoryId: value || undefined })}
        allowClear
      >
        <Select.Option value={1}>Category 1</Select.Option>
      </Select>

      {/* Badge hiển thị số filters đang active */}
      {pagination.activeFiltersCount > 0 && (
        <Badge count={pagination.activeFiltersCount}>
          <Button onClick={() => pagination.clearFilters()}>Xóa bộ lọc</Button>
        </Badge>
      )}

      {/* Table */}
      <Table
        dataSource={pagination.items}
        loading={pagination.isLoading}
        pagination={{
          current: pagination.params.page,
          pageSize: pagination.params.pageSize,
          total: pagination.totalCount,
          onChange: pagination.handlePageChange,
        }}
      />
    </div>
  );
}
```

### Advanced Filters

Hook tự động đọc tất cả filters từ URL (ngoài pagination và sort params):

```typescript
// URL: /admin/products?page=2&categoryId=5&minPrice=100&maxPrice=500&search=laptop

// Hook tự động đọc:
pagination.filters.categoryId  // 5
pagination.filters.minPrice     // 100
pagination.filters.maxPrice     // 500
pagination.params.search        // 'laptop'
pagination.params.page          // 2

// Update filter
pagination.handleFilterChange({ supplierId: 10 });
// → URL updates: /admin/products?page=1&categoryId=5&supplierId=10&minPrice=100&maxPrice=500&search=laptop
// → page tự động reset về 1

// Clear specific filters
pagination.clearFilters(['minPrice', 'maxPrice']);
// → URL updates: /admin/products?page=1&categoryId=5&supplierId=10&search=laptop

// Clear all filters
pagination.clearFilters();
// → URL updates: /admin/products?page=1&search=laptop
```

## 3. usePaginationLocal

**File**: `src/hooks/usePaginationLocal.ts`

**Mục đích**: Local state pagination cho Modal/Drawer. Quản lý state bằng `useState`.

**Khi nào dùng**:
- ✅ Modal components (không có router context)
- ✅ Drawer components
- ✅ Nested components độc lập
- ✅ Storybook components
- ✅ Unit tests đơn giản
- ❌ KHÔNG dùng cho Page components (nên dùng `usePaginationWithRouter`)

### API

**Config**:
```typescript
{
  apiService: BaseApiService<TData>;
  entity: string;
  initialParams?: Partial<PagedRequest>;
  initialFilters?: TFilters;
}
```

**Returns**: Tương tự `usePaginationWithRouter`, nhưng thêm:
```typescript
{
  // Direct state
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDesc: boolean;
  
  // Direct setters (nếu cần)
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortDesc: (sortDesc: boolean) => void;
  setFilters: (filters: TFilters) => void;
}
```

### Ví dụ sử dụng

```typescript
import { useProductsLocal } from '@/features/products/hooks';
import type { ProductFilters } from '@/features/products/hooks';

export function ProductSelectionModal({ visible, onSelect, onCancel }) {
  const pagination = useProductsLocal<ProductEntity, ProductFilters>({
    initialFilters: { inStock: true },
    initialParams: { sortBy: 'ProductName' },
  });

  return (
    <Modal visible={visible} onCancel={onCancel}>
      {/* Search */}
      <Input.Search
        onSearch={pagination.handleSearch}
        defaultValue={pagination.search}
      />

      {/* Filters */}
      <Select
        value={pagination.filters.categoryId}
        onChange={(value) => pagination.handleFilterChange({ categoryId: value || undefined })}
      >
        <Select.Option value={1}>Category 1</Select.Option>
      </Select>

      {/* Badge */}
      {pagination.activeFiltersCount > 0 && (
        <Badge count={pagination.activeFiltersCount}>
          <Button onClick={() => pagination.clearFilters()}>Xóa bộ lọc</Button>
        </Badge>
      )}

      {/* Table */}
      <Table
        dataSource={pagination.items}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total: pagination.totalCount,
          onChange: pagination.handlePageChange,
        }}
      />
    </Modal>
  );
}
```

## So sánh

| Feature | useApiPaginated | usePaginationWithRouter | usePaginationLocal |
|--------|-----------------|------------------------|-------------------|
| State Management | Nhận từ props | URL query params | useState |
| Router Context | Không cần | Cần | Không cần |
| URL Sync | Không | Có | Không |
| Advanced Filters | Tự implement | Hỗ trợ đầy đủ | Hỗ trợ đầy đủ |
| Use Case | Nested components | Page components | Modal/Drawer |
| Deep Linking | Không | Có | Không |
| Shareable URLs | Không | Có | Không |

## Best Practices

1. **Chọn đúng hook**: Sử dụng decision tree để chọn hook phù hợp
2. **URL sync cho Pages**: Luôn dùng `usePaginationWithRouter` cho Page components
3. **Local state cho Modals**: Luôn dùng `usePaginationLocal` cho Modal/Drawer
4. **Filters**: Sử dụng `handleFilterChange` và `clearFilters` thay vì set state trực tiếp
5. **Active filters count**: Sử dụng `activeFiltersCount` để hiển thị badge

## Troubleshooting

### URL không sync khi thay đổi filter

**Nguyên nhân**: Không sử dụng `handleFilterChange`, mà set state trực tiếp.

**Giải pháp**: Luôn dùng `handleFilterChange`:
```typescript
// ✅ Đúng
pagination.handleFilterChange({ categoryId: 1 });

// ❌ Sai
pagination.setFilters({ categoryId: 1 }); // Không trigger URL update
```

### Filters không được đọc từ URL

**Nguyên nhân**: Route API không expose đúng search params.

**Giải pháp**: Kiểm tra `routeApi.useSearch()` trả về đúng structure:
```typescript
const search = routeApi.useSearch();
console.log(search); // Phải có categoryId, minPrice, etc.
```

