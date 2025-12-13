# Universal Hooks Documentation

## Tổng quan

Universal Hooks (`src/hooks/useApi.ts`) cung cấp bộ hooks generic có thể dùng cho mọi entity thông qua `BaseApiService`.

## Query Key Factory

### createQueryKeys

**Mục đích**: Tạo cấu trúc query keys phân cấp cho TanStack Query.

**Signature**:
```typescript
function createQueryKeys(entity: string)
```

**Cấu trúc**:
```
[entity]                           // all: Base key
  ├── [entity, 'list']             // lists: Base cho list queries
  │   └── [entity, 'list', params] // list: List query với params
  └── [entity, 'detail']           // details: Base cho detail queries
      └── [entity, 'detail', id]   // detail: Detail query với id
```

**Ví dụ**:
```typescript
const productKeys = createQueryKeys('products');
productKeys.all                    // ['products']
productKeys.lists()                 // ['products', 'list']
productKeys.list({ search: 'laptop' })  // ['products', 'list', { search: 'laptop' }]
productKeys.details()               // ['products', 'detail']
productKeys.detail(123)            // ['products', 'detail', 123]
```

**Lợi ích**:
- Invalidate theo nhóm dễ dàng
- Type-safe, tránh typo
- Tái sử dụng cho mọi entity

## Query Hooks

### useApiList

**Mục đích**: GET danh sách items (không phân trang).

**Signature**:
```typescript
function useApiList<TData, TError>(config: UseApiListConfig<TData, TError>)
```

**Config**:
- `apiService: BaseApiService<TData>`
- `entity: string`
- `params?: QueryParams` - Query params (filter, search, etc.)
- `options?: UseQueryOptions` - TanStack Query options (staleTime, enabled, etc.)

**Returns**: Query result từ `useQuery` với `data: TData[] | undefined`

**Ví dụ**:
```typescript
const { data: products, isLoading } = useApiList<ProductEntity>({
  apiService: productApiService,
  entity: 'products',
  params: { search: 'laptop' },
});
```

### useApiPaginated

**Mục đích**: GET danh sách có phân trang (core hook).

**Signature**:
```typescript
function useApiPaginated<TData, TError>(config: UseApiPaginatedConfig<TData, TError>)
```

**Config**:
- `apiService: BaseApiService<TData>`
- `entity: string`
- `params?: PagedRequest` - Pagination params
- `options?: UseQueryOptions` - TanStack Query options

**Returns**: Query result với `data: PagedList<TData> | undefined`

**Đặc điểm**:
- Sử dụng `placeholderData` để giữ data cũ khi fetch trang mới
- Query key: `[...queryKeys.lists(), 'paginated', params]`

**Ví dụ**:
```typescript
const { data, isLoading } = useApiPaginated<ProductEntity>({
  apiService: productApiService,
  entity: 'products',
  params: { page: 1, pageSize: 20, search: 'laptop' },
});
```

### useApiDetail

**Mục đích**: GET item theo ID.

**Signature**:
```typescript
function useApiDetail<TData, TError>(config: UseApiDetailConfig<TData, TError>)
```

**Config**:
- `apiService: BaseApiService<TData>`
- `entity: string`
- `id: string | number`
- `options?: UseQueryOptions`

**Returns**: Query result với `data: TData | undefined`

**Đặc điểm**:
- Tự động disable khi `id` là falsy (`enabled: !!id`)

**Ví dụ**:
```typescript
const { data: product, isLoading } = useApiDetail<ProductEntity>({
  apiService: productApiService,
  entity: 'products',
  id: 123,
});
```

## Mutation Hooks

### useApiCreate

**Mục đích**: POST tạo mới item.

**Signature**:
```typescript
function useApiCreate<TData, TCreate, TError>(config: UseApiMutationConfig<TData, TCreate, TError>)
```

**Config**:
- `apiService: BaseApiService<TData>`
- `entity: string`
- `invalidateQueries?: string[]` - Query keys cần invalidate thêm
- `options?: UseMutationOptions` - TanStack Query mutation options

**Returns**: Mutation result từ `useMutation`

**Cache Invalidation**:
- Tự động invalidate: `['products', 'list']` và tất cả list queries
- Invalidate thêm: Các queries trong `invalidateQueries` array

**Ví dụ**:
```typescript
const createProduct = useApiCreate<ProductEntity, CreateProductRequest>({
  apiService: productApiService,
  entity: 'products',
  options: {
    onSuccess: (data) => {
      toast.success('Product created!');
      navigate('/products');
    },
  },
});

// Sử dụng
createProduct.mutate({ productName: 'Laptop', price: 1000 });
```

### useApiUpdate

**Mục đích**: PUT update toàn bộ item.

**Signature**:
```typescript
function useApiUpdate<TData, TUpdate, TError>(config: UseApiMutationConfig<TData, { id: string | number; data: TUpdate }, TError>)
```

**Variables Format**: `{ id: string | number, data: TUpdate }`

**Cache Invalidation**:
- Invalidate lists
- Invalidate detail query của item vừa update

**Ví dụ**:
```typescript
const updateProduct = useApiUpdate<ProductEntity, UpdateProductRequest>({
  apiService: productApiService,
  entity: 'products',
});

updateProduct.mutate({ id: 123, data: { productName: 'New Name', price: 2000 } });
```

### useApiPatch

**Mục đích**: PATCH partial update.

**Signature**:
```typescript
function useApiPatch<TData, TUpdate, TError>(config: UseApiMutationConfig<TData, { id: string | number; data: Partial<TUpdate> }, TError>)
```

**Variables Format**: `{ id: string | number, data: Partial<TUpdate> }`

**Ví dụ**:
```typescript
const patchProduct = useApiPatch<ProductEntity, UpdateProductRequest>({
  apiService: productApiService,
  entity: 'products',
});

// Chỉ update price, không cần gửi toàn bộ object
patchProduct.mutate({ id: 123, data: { price: 1500 } });
```

### useApiDelete

**Mục đích**: DELETE item.

**Signature**:
```typescript
function useApiDelete<TData, TError>(config: UseApiMutationConfig<TData, string | number, TError>)
```

**Variables Format**: `string | number` (id của item)

**Cache Invalidation**:
- Invalidate lists
- Remove detail query của item vừa xóa (không còn tồn tại)

**Ví dụ**:
```typescript
const deleteProduct = useApiDelete<ProductEntity>({
  apiService: productApiService,
  entity: 'products',
});

deleteProduct.mutate(123);
```

## Custom Hooks

### useApiCustomQuery

**Mục đích**: Custom queries với query function tùy chỉnh.

**Signature**:
```typescript
function useApiCustomQuery<TData, TError>(config: {
  apiService: BaseApiService<any>;
  entity: string;
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  options?: UseQueryOptions;
})
```

**Ví dụ**:
```typescript
const { data } = useApiCustomQuery<PagedList<ProductEntity>>({
  apiService: productApiService,
  entity: 'products',
  queryKey: ['category', categoryId, params],
  queryFn: () => productApiService.getProductsByCategory(categoryId, params),
});
```

### useApiCustomMutation

**Mục đích**: Custom mutations với mutation function tùy chỉnh.

**Signature**:
```typescript
function useApiCustomMutation<TData, TVariables, TError>(config: {
  apiService: BaseApiService<any>;
  entity: string;
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateQueries?: string[];
  options?: UseMutationOptions;
})
```

**Ví dụ**:
```typescript
const customMutation = useApiCustomMutation<ProductEntity, CustomRequest>({
  apiService: productApiService,
  entity: 'products',
  mutationFn: (data) => productApiService.custom('post', '/custom-endpoint', data),
});
```

## Best Practices

1. **Luôn specify generic types**: `useApiList<ProductEntity>` thay vì `useApiList`
2. **Sử dụng options để customize**: `staleTime`, `enabled`, `onSuccess`, etc.
3. **Invalidate queries đúng cách**: Sử dụng `invalidateQueries` cho các queries liên quan
4. **Error handling**: Sử dụng `onError` trong options để handle errors
5. **Optimistic updates**: Sử dụng `onMutate` trong mutation options

## Troubleshooting

### Query không refetch khi params thay đổi

**Nguyên nhân**: Query key không thay đổi khi params thay đổi.

**Giải pháp**: Đảm bảo params được include trong query key:
```typescript
queryKey: queryKeys.list(params) // ✅ Đúng
queryKey: queryKeys.lists()      // ❌ Sai - không có params
```

### Cache không được invalidate sau mutation

**Nguyên nhân**: Query key không khớp với key được invalidate.

**Giải pháp**: Sử dụng query key factory để đảm bảo consistency:
```typescript
// ✅ Đúng - sử dụng factory
queryClient.invalidateQueries({ queryKey: queryKeys.lists() });

// ❌ Sai - hard-code key
queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
```

