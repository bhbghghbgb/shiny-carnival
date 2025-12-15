# Migration Guide - Từ Code Cũ sang CustomHookAPIFactory

## Tổng quan

Hướng dẫn này mô tả cách migrate từ code cũ (manual API calls) sang CustomHookAPIFactory pattern.

## Migration Strategy

### Phương pháp: Incremental Migration

1. **Giữ code cũ tạm thời**: Không xóa ngay, để rollback nếu cần
2. **Migrate từng feature**: Bắt đầu với Products, Users, sau đó các features khác
3. **Migrate từng component**: Trong mỗi feature, migrate từng component một
4. **Test sau mỗi bước**: Đảm bảo functionality vẫn hoạt động

## Migration Steps

### Step 1: Tạo ApiService cho Feature

1. Tạo file `src/features/[entity]/api/[Entity]ApiService.ts`
2. Extend `BaseApiService`:

```typescript
import { BaseApiService } from '../../../lib/api/base';
import axiosClient from '../../../lib/axios';
import { API_CONFIG } from '../../../config/api';
import type { [Entity]Entity } from '../types/entity';
import type { Create[Entity]Request, Update[Entity]Request } from '../types/api';

export class [Entity]ApiService extends BaseApiService<
  [Entity]Entity,
  Create[Entity]Request,
  Update[Entity]Request
> {
  constructor() {
    super({
      endpoint: API_CONFIG.ENDPOINTS.ADMIN.[ENTITY]S,
      axiosInstance: axiosClient,
    });
  }

  // Thêm custom methods nếu cần
}

export const [entity]ApiService = new [Entity]ApiService();
```

3. Export trong `src/features/[entity]/api/index.ts`

### Step 2: Tạo Hooks Wrapper

1. Tạo file `src/features/[entity]/hooks/use[Entity]s.ts`
2. Import universal hooks:

```typescript
import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
} from '../../../hooks/useApi';
import { [entity]ApiService } from '../api/[Entity]ApiService';

const ENTITY = '[entity]s';
```

3. Tạo hooks wrapper:

```typescript
export const use[Entity]s = (params?: Record<string, unknown>) => {
  return useApiList<[Entity]Entity>({
    apiService: [entity]ApiService,
    entity: ENTITY,
    params,
  });
};

export const use[Entity] = (id: string | number) => {
  return useApiDetail<[Entity]Entity>({
    apiService: [entity]ApiService,
    entity: ENTITY,
    id,
  });
};

// ... các hooks khác
```

4. Export trong `src/features/[entity]/hooks/index.ts`

### Step 3: Migrate Component

#### Before: Manual API Calls

```typescript
function [Entity]List() {
  const [items, setItems] = useState<[Entity]Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await [entity]Api.get[Entity]s();
        if (!response.isError && response.data) {
          setItems(response.data);
        } else {
          setError(new Error(response.message));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### After: Sử dụng Hooks

```typescript
import { use[Entity]s } from '@/features/[entity]/hooks';

function [Entity]List() {
  const { data: items, isLoading, error } = use[Entity]s();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {items?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Step 4: Migrate Mutations

#### Before: Manual Mutation

```typescript
function Create[Entity]Form() {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: Create[Entity]Request) => {
    setCreating(true);
    try {
      const response = await [entity]Api.create[Entity](formData);
      if (!response.isError && response.data) {
        toast.success('Created!');
        navigate('/[entity]s');
        // Phải refetch thủ công
        await refetch[Entity]s();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error('Failed!');
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={creating}>
        {creating ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

#### After: Sử dụng Mutation Hook

```typescript
import { useCreate[Entity] } from '@/features/[entity]/hooks';

function Create[Entity]Form() {
  const navigate = useNavigate();
  const create[Entity] = useCreate[Entity]({
    options: {
      onSuccess: () => {
        toast.success('Created!');
        navigate('/[entity]s');
        // Cache tự động invalidate, không cần refetch thủ công
      },
      onError: (error) => {
        toast.error(error.message || 'Failed!');
      },
    },
  });

  const handleSubmit = (formData: Create[Entity]Request) => {
    create[Entity].mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={create[Entity].isPending}>
        {create[Entity].isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## Migration Checklist

### Cho mỗi Feature

- [ ] Tạo `[Entity]ApiService` extends `BaseApiService`
- [ ] Tạo hooks wrapper (`use[Entity]s`, `use[Entity]`, `useCreate[Entity]`, etc.)
- [ ] Tạo pagination hooks nếu cần (`use[Entity]sWithRouter`, `use[Entity]sLocal`)
- [ ] Migrate List component
- [ ] Migrate Detail component
- [ ] Migrate Create component
- [ ] Migrate Update component
- [ ] Migrate Delete functionality
- [ ] Test tất cả CRUD operations
- [ ] Test pagination (nếu có)
- [ ] Test filters (nếu có)
- [ ] Remove code cũ (sau khi đã test kỹ)

## Common Patterns

### Pattern 1: List với Pagination (URL sync)

**Before**:
```typescript
const [page, setPage] = useState(1);
const [data, setData] = useState<PagedList<[Entity]Entity>>();

useEffect(() => {
  const fetchData = async () => {
    const response = await [entity]Api.get[Entity]s({ page, pageSize: 20 });
    if (!response.isError && response.data) {
      setData(response.data);
    }
  };
  fetchData();
}, [page]);
```

**After**:
```typescript
import { use[Entity]sWithRouter } from '@/features/[entity]/hooks';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/[entity]s');
const pagination = use[Entity]sWithRouter({ routeApi });

// Sử dụng
<Table
  dataSource={pagination.items}
  pagination={{
    current: pagination.params.page,
    total: pagination.totalCount,
    onChange: pagination.handlePageChange,
  }}
/>
```

### Pattern 2: List trong Modal (Local state)

**Before**:
```typescript
const [page, setPage] = useState(1);
const [data, setData] = useState<PagedList<[Entity]Entity>>();

useEffect(() => {
  const fetchData = async () => {
    const response = await [entity]Api.get[Entity]s({ page, pageSize: 20 });
    if (!response.isError && response.data) {
      setData(response.data);
    }
  };
  fetchData();
}, [page]);
```

**After**:
```typescript
import { use[Entity]sLocal } from '@/features/[entity]/hooks';

const pagination = use[Entity]sLocal();

// Sử dụng
<Table
  dataSource={pagination.items}
  pagination={{
    current: pagination.page,
    total: pagination.totalCount,
    onChange: pagination.handlePageChange,
  }}
/>
```

## Breaking Changes

### 1. Return Type

**Before**: `ApiResponse<T>` hoặc `ApiResponse<PagedList<T>>`
**After**: `T` hoặc `PagedList<T>` (đã unwrap)

### 2. Error Handling

**Before**: Phải check `response.isError` thủ công
**After**: Hooks tự động throw error, sử dụng `error` từ hook

### 3. Loading State

**Before**: `loading` state thủ công
**After**: `isLoading` hoặc `isPending` từ hook

### 4. Cache Management

**Before**: Phải refetch thủ công sau mutations
**After**: Cache tự động invalidate, không cần refetch

## Rollback Plan

Nếu cần rollback:

1. **Giữ code cũ**: Không xóa ngay, comment lại
2. **Revert imports**: Thay hooks bằng API calls cũ
3. **Restore state management**: Thêm lại `useState` và `useEffect`
4. **Test**: Đảm bảo functionality vẫn hoạt động

## Testing After Migration

1. **Unit Tests**: Test hooks với `QueryClientProvider`
2. **Integration Tests**: Test components sử dụng hooks
3. **E2E Tests**: Test user flows end-to-end
4. **Manual Testing**: Test tất cả CRUD operations

## Next Steps

Sau khi migrate xong một feature:
1. Review code với team
2. Update documentation
3. Migrate feature tiếp theo
4. Remove code cũ sau khi tất cả features đã migrate

