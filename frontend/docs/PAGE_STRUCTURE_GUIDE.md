# Hướng Dẫn Cấu Trúc Page - UserManagementPage Pattern

## Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Kiến Trúc Tổng Thể](#kiến-trúc-tổng-thể)
3. [Cấu Trúc Chi Tiết](#cấu-trúc-chi-tiết)
4. [Pattern và Best Practices](#pattern-và-best-practices)
5. [Code Examples](#code-examples)
6. [Hướng Dẫn Áp Dụng](#hướng-dẫn-áp-dụng)

---

## Tổng Quan

`UserManagementPage` là một pattern chuẩn cho các trang quản lý (CRUD) trong hệ thống. Pattern này tuân theo các nguyên tắc:

- **Separation of Concerns**: Tách biệt logic và UI
- **Composition over Inheritance**: Sử dụng composition với các components nhỏ
- **Custom Hooks**: Tập trung logic vào custom hooks
- **Type Safety**: Sử dụng TypeScript với type definitions rõ ràng
- **URL State Management**: Quản lý state thông qua URL query params (TanStack Router)

---

## Kiến Trúc Tổng Thể

### Call Graph Overview

Dựa trên call graph thực tế, đây là mối quan hệ giữa các components:

```
UserManagementPage
├── useUserManagementPage (hook)
│   ├── TanStack Router
│   │   ├── getRouteApi()
│   │   ├── useNavigate()
│   │   ├── useRouter()
│   │   └── routeApi.useLoaderData() → fetchUsers (loader)
│   ├── React Hooks
│   │   ├── useState() (modals, form state)
│   │   └── Form.useForm()
│   └── Mutation Hooks
│       ├── useCreateUser → useApiCreate → useMutation → BaseApiService.create → axios.post
│       ├── useUpdateUser → useApiUpdate → useMutation → BaseApiService.update → axios.put
│       └── useDeleteUser → useApiDelete → useMutation → BaseApiService.delete → axios.delete
├── UserHeader
├── UserStatistics
├── UserSearchFilter
├── UserTable
└── UserModals
    └── UserForm (nested)
```

**Key Dependencies**:
- **Route Loader** (`fetchUsers`) → `userApiService.getPaginated()` → `BaseApiService` → `axios.get()` → `unwrapResponse()`
- **Mutation Hooks** → `useApiCreate/Update/Delete` → `useMutation` → `BaseApiService` → `axios.post/put/delete()` → `unwrapResponse()`
- **Query Invalidation**: Tự động invalidate TanStack Query cache + `router.invalidate()` để refetch loader

### Cấu Trúc Thư Mục

```
features/users/
├── pages/
│   └── UserManagementPage.tsx      # Main page component
├── hooks/
│   └── useUserManagementPage.ts    # Business logic hook
├── components/
│   ├── UserHeader.tsx              # Header với title và action button
│   ├── UserStatistics.tsx         # Statistics cards
│   ├── UserSearchFilter.tsx       # Search, filter, sort controls
│   ├── UserTable.tsx              # Data table
│   ├── UserModals.tsx             # All modals (add/edit/delete/notification)
│   └── UserForm.tsx               # Form component
├── types/
│   ├── entity.ts                  # Entity types
│   └── api.ts                     # API request/response types
└── api/
    ├── UserApiService.ts          # API service (extends BaseApiService)
    └── useUsers.ts                # API mutation hooks (wraps useApi hooks)
```

### Luồng Dữ Liệu

#### Data Fetching Flow (Read Operations)

```
┌─────────────────────────────────────────────────────────┐
│                    UserManagementPage                    │
│  (Container Component - chỉ render và kết nối)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ useUserManagementPage  │
        │  (Business Logic Hook) │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ routeApi.useLoaderData()│
        │  (TanStack Router)     │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ fetchUsers (Loader)     │
        │  (users.definition.ts)  │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ userApiService          │
        │  .getPaginated()       │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ BaseApiService          │
        │  .getPaginated()       │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ axios.get()             │
        │  (HTTP Request)         │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ unwrapResponse()        │
        │  (ApiResponse Adapter)  │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ PagedList<UserEntity>  │
        │  (Return to Loader)    │
        └────────────────────────┘
```

#### Mutation Flow (Create/Update/Delete Operations)

```
┌─────────────────────────────────────────────────────────┐
│                    UserManagementPage                    │
│  (User Action: Create/Update/Delete)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ useUserManagementPage  │
        │  handleOk/handleDelete  │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ useCreateUser/          │
        │ useUpdateUser/          │
        │ useDeleteUser           │
        │  (useUsers.ts)          │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ useApiCreate/          │
        │ useApiUpdate/           │
        │ useApiDelete            │
        │  (useApi.ts)           │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ useMutation             │
        │  (TanStack Query)       │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ BaseApiService          │
        │  .create/.update/.delete│
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ axios.post/put/delete() │
        │  (HTTP Request)         │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ unwrapResponse()        │
        │  (ApiResponse Adapter)  │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ invalidateQueries()     │
        │  (TanStack Query)       │
        │  + router.invalidate()  │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ Refetch Data            │
        │  (Loader re-runs)       │
        └────────────────────────┘
```

#### Component Hierarchy

```
UserManagementPage
├── UserHeader
│   └── (onAddUser callback)
├── UserStatistics
│   └── (displays stats from hook)
├── UserSearchFilter
│   └── (search/filter/sort handlers)
├── UserTable
│   └── (onEditUser, onDeleteUser callbacks)
└── UserModals
    ├── Add/Edit Modal
    │   └── UserForm (nested inside modal)
    ├── Delete Confirmation Modal
    └── Notification Modal (Success/Error)
```

---

## Cấu Trúc Chi Tiết

### 1. Page Component (`UserManagementPage.tsx`)

**Vai trò**: Container component, chỉ chịu trách nhiệm render và kết nối các components.

**Đặc điểm**:
- Không chứa business logic
- Sử dụng custom hook để lấy tất cả state và handlers
- Sử dụng Ant Design `Space` để layout
- Truyền props xuống các child components

**Code Structure**:

```tsx
export function UserManagementPage() {
    // Destructure tất cả từ custom hook
    const {
        // Data
        users,
        totalUsers,
        adminCount,
        staffCount,
        
        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        isNotificationModalVisible,
        notificationType,
        notificationMessage,
        editingUser,
        deletingUser,
        form,
        
        // Search/Filter states
        searchText,
        roleFilter,
        sortField,
        sortOrder,
        
        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleNotificationClose,
        handleSearch,
        handleRoleFilter,
        handleSort,
        clearFilters,
    } = useUserManagementPage()

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <UserHeader onAddUser={showModal} />
                
                {/* Statistics */}
                <UserStatistics
                    totalUsers={totalUsers}
                    adminCount={adminCount}
                    staffCount={staffCount}
                />
                
                {/* Search and Filter Controls */}
                <UserSearchFilter
                    searchText={searchText}
                    roleFilter={roleFilter}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSearchChange={handleSearch}
                    onRoleFilterChange={handleRoleFilter}
                    onSortChange={handleSort}
                    onClearFilters={clearFilters}
                />
                
                {/* Table */}
                <UserTable
                    users={users}
                    onEditUser={showEditModal}
                    onDeleteUser={showDeleteModal}
                />
            </Space>
            
            {/* Modals */}
            <UserModals
                isModalVisible={isModalVisible}
                isDeleteModalVisible={isDeleteModalVisible}
                isNotificationModalVisible={isNotificationModalVisible}
                notificationType={notificationType}
                notificationMessage={notificationMessage}
                editingUser={editingUser}
                deletingUser={deletingUser}
                form={form}
                onModalOk={handleOk}
                onModalCancel={handleCancel}
                onDeleteOk={handleDelete}
                onDeleteCancel={handleDeleteCancel}
                onNotificationClose={handleNotificationClose}
            />
        </div>
    )
}
```

### 2. Custom Hook (`useUserManagementPage.ts`)

**Vai trò**: Tập trung tất cả business logic, state management, và side effects.

**Các phần chính**:

#### 2.1. Route Integration (TanStack Router)

```typescript
// Lấy route API và search params từ URL
const routeApi = getRouteApi(ENDPOINTS.ADMIN.USERS)
const { users: usersData, total: totalUsers } = routeApi.useLoaderData() || { users: [], total: 0 }
const search = routeApi.useSearch()
const navigate = useNavigate({ from: ENDPOINTS.ADMIN.USERS })
const router = useRouter()
```

**Luồng hoạt động**:
1. **Route Loader** (`fetchUsers` trong `users.definition.ts`):
   - Được định nghĩa trong route definition
   - Tự động chạy khi route được mount hoặc search params thay đổi
   - Gọi `userApiService.getPaginated()` với params từ URL
   - Trả về `{ users: UserNoPass[], total: number }`

2. **Data Flow**:
   - Loader → `userApiService.getPaginated()` → `BaseApiService.getPaginated()` → `axios.get()` → `unwrapResponse()` → `PagedList<UserEntity>`
   - Loader filter theo role ở client-side (backend không hỗ trợ)
   - Data được cache bởi TanStack Router

**Lợi ích**:
- State được lưu trong URL, có thể bookmark/share
- Tự động sync với browser back/forward
- Data được fetch qua loader, tối ưu performance
- SSR-ready (loader có thể chạy trên server)

#### 2.2. Local State Management

```typescript
// Modal states
const [isModalVisible, setIsModalVisible] = useState(false)
const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false)
const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
const [notificationMessage, setNotificationMessage] = useState<string>('')
const [editingUser, setEditingUser] = useState<UserNoPass | null>(null)
const [deletingUser, setDeletingUser] = useState<UserNoPass | null>(null)
const [form] = Form.useForm()
```

#### 2.3. Mutation Hooks Integration

**Cấu trúc phân lớp**:

```typescript
// Layer 1: Feature-specific hooks (useUsers.ts)
const createUser = useCreateUser({
    onSuccess: (data) => {
        form.resetFields()
        setIsModalVisible(false)
        setEditingUser(null)
        setNotificationType('success')
        setNotificationMessage('Thêm người dùng thành công!')
        setIsNotificationModalVisible(true)
        router.invalidate() // Refetch route loader
    },
    onError: (error: Error) => {
        setNotificationType('error')
        setNotificationMessage(error.message || 'Không thể tạo người dùng mới')
        setIsNotificationModalVisible(true)
    },
})
```

**Luồng hoạt động chi tiết**:

1. **useCreateUser** (từ `useUsers.ts`):
   ```typescript
   export const useCreateUser = (options) => {
     return useApiCreate<UserEntity, CreateUserRequest>({
       apiService: userApiService,
       entity: 'users',
       options,
     });
   };
   ```

2. **useApiCreate** (từ `useApi.ts`):
   - Sử dụng `useMutation` từ TanStack Query
   - Tự động invalidate list queries sau khi thành công
   - Gọi `apiService.create(data)` trong `mutationFn`

3. **BaseApiService.create**:
   - Gọi `axios.post()` với endpoint và data
   - Sử dụng `unwrapResponse()` để unwrap `ApiResponse<T>` → `T`
   - Throw error nếu `isError === true`

4. **Query Invalidation**:
   - `useApiCreate` tự động invalidate `['users', 'list']` queries
   - `router.invalidate()` trong `onSuccess` để refetch route loader

**Pattern**:
- **Separation of Concerns**: Feature hooks → Generic API hooks → Base Service
- **Automatic Cache Management**: TanStack Query tự động invalidate related queries
- **Error Handling**: Tự động unwrap và throw errors từ API responses
- **Type Safety**: Full type inference từ entity types đến API requests

#### 2.4. Search/Filter/Sort Handlers

```typescript
// Đọc từ URL
const searchText = search?.search || ''
const roleFilter = (search as UserSearch | undefined)?.role
const sortField = (search as UserSearch | undefined)?.sortField || 'createdAt'
const sortOrder = (search as UserSearch | undefined)?.sortOrder || 'descend'

// Update URL (sẽ trigger loader refetch)
const handleSearch = (value: string) => {
    navigate({
        search: (prev: UserSearch) => ({
            ...prev,
            search: value || undefined,
            page: 1, // Reset về trang đầu khi search
        }),
    })
}
```

**Lưu ý**:
- Luôn reset `page: 1` khi thay đổi filter/search
- Sử dụng `undefined` để remove query param khỏi URL
- TanStack Router tự động refetch loader khi search params thay đổi

#### 2.5. Form Handling

```typescript
const handleOk = async () => {
    try {
        const values = await form.validateFields()
        
        if (editingUser) {
            // Update logic
            const updateData: UpdateUserRequest = {
                id: editingUser.id,
                username: values.username,
                fullName: values.fullName,
                role: values.role,
                // Xử lý password: null = không đổi, có giá trị = đổi password
                password: (values.password === undefined || values.password === '')
                    ? null
                    : values.password,
            }
            updateUser.mutate({ id: editingUser.id, data: updateData })
        } else {
            // Create logic
            createUser.mutate(values)
        }
    } catch (error) {
        // Validation errors được handle tự động bởi Ant Design Form
    }
}
```

### 3. Component Structure

#### 3.1. Header Component (`UserHeader.tsx`)

**Vai trò**: Hiển thị title và primary action button.

**Props**:
```typescript
interface UserHeaderProps {
    onAddUser: () => void
}
```

**Pattern**:
- Sử dụng Ant Design `Card`, `Row`, `Col` để layout
- Icon + Title + Description
- Primary action button ở bên phải

#### 3.2. Statistics Component (`UserStatistics.tsx`)

**Vai trò**: Hiển thị các thống kê tổng quan.

**Props**:
```typescript
interface UserStatisticsProps {
    totalUsers: number
    adminCount: number
    staffCount: number
}
```

**Pattern**:
- Sử dụng `Statistic` component từ Ant Design
- Mỗi statistic trong một `Card` riêng
- Grid layout với `Row` và `Col`

#### 3.3. Search Filter Component (`UserSearchFilter.tsx`)

**Vai trò**: Cung cấp các controls để search, filter, và sort.

**Props**:
```typescript
interface UserSearchFilterProps {
    searchText: string
    roleFilter: number | undefined
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onRoleFilterChange: (value: number | undefined) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}
```

**Pattern**:
- Controlled components (value + onChange)
- Sử dụng `Input.Search`, `Select` từ Ant Design
- Clear filters button để reset về default

#### 3.4. Table Component (`UserTable.tsx`)

**Vai trò**: Hiển thị data trong bảng với actions.

**Props**:
```typescript
interface UserTableProps {
    users: UserNoPass[]
    onEditUser: (user: UserNoPass) => void
    onDeleteUser: (user: UserNoPass) => void
}
```

**Pattern**:
- Sử dụng Ant Design `Table`
- Custom render cho các columns
- Action buttons với icons và tooltips
- Pagination configuration

#### 3.5. Modals Component (`UserModals.tsx`)

**Vai trò**: Tập trung tất cả modals (add/edit, delete, notification).

**Props**:
```typescript
interface UserModalsProps {
    isModalVisible: boolean
    isDeleteModalVisible: boolean
    isNotificationModalVisible: boolean
    notificationType: 'success' | 'error'
    notificationMessage: string
    editingUser: UserNoPass | null
    deletingUser: UserNoPass | null
    form: FormInstance
    onModalOk: () => void
    onModalCancel: () => void
    onDeleteOk: () => void
    onDeleteCancel: () => void
    onNotificationClose: () => void
}
```

**Pattern**:
- Group tất cả modals vào một component
- Conditional rendering dựa trên state
- Reusable form component với key để force re-render

#### 3.6. Form Component (`UserForm.tsx`)

**Vai trò**: Form fields cho add/edit.

**Props**:
```typescript
interface UserFormProps {
    form: FormInstance
    isEdit?: boolean
    initialValues?: UserNoPass
}
```

**Pattern**:
- Sử dụng Ant Design `Form`
- Conditional validation (password optional trong edit mode)
- Disable fields khi cần (username trong edit mode)
- **Lưu ý**: Form được sử dụng bên trong `UserModals`, không được gọi trực tiếp từ Page

**Sử dụng trong UserModals**:
```typescript
<UserForm
    key={editingUser ? `edit-${editingUser.id}` : 'add-new'}
    form={form}
    isEdit={!!editingUser}
    initialValues={editingUser || undefined}
/>
```

**Key prop**: Sử dụng key để force re-render form khi chuyển giữa add/edit mode

---

## Code Chi Tiết Từng File

Dưới đây là code đầy đủ của từng file trong call graph, được sắp xếp theo thứ tự dependency:

### 1. Route Definition với Loader

**File**: `app/routes/modules/management/definition/users.definition.ts`

```typescript
import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { UserManagementPage } from '../../../../../features/users/pages/UserManagementPage.tsx';
import { userApiService } from '../../../../../features/users/api';
import type { UserNoPass } from '../../../../../features/users/types/entity.ts';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';

// 1. Định nghĩa Types và API

interface UserLoaderData {
  users: UserNoPass[];
  total: number;
}

const userSearchSchema = baseSearchSchema.extend({
  role: z.number().optional(), // Filter theo role (client-side, backend không hỗ trợ)
  sortField: z.string().catch('createdAt'), // ✅ Default: 'createdAt'
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'), // ✅ Default: 'descend'
});

export type UserSearch = z.infer<typeof userSearchSchema>;

async function fetchUsers(ctx: LoaderContext<Record<string, never>, UserSearch, { apiClient: never }>): Promise<UserLoaderData> {
  const search = ctx.search;
  console.log('🔍 [Loader] Fetching users with filters:', search);

  try {
    // Convert search params sang PagedRequest format (theo swagger.json)
    // Backend expect: Page, PageSize, Search, SortBy, SortDesc (PascalCase)
    const params: PagedRequest = {
      page: search.page || 1,
      pageSize: search.pageSize || 10,
      search: search.search,
      // Convert sortField sang SortBy format của backend
      sortBy: search.sortField === 'createdAt' ? 'CreatedAt' :
        search.sortField === 'username' ? 'Username' :
          search.sortField === 'fullName' ? 'FullName' : 'Id',
      sortDesc: search.sortOrder === 'descend',
    };

    console.log('📤 [Loader] Calling API with params:', params);

    // Gọi API thật từ backend (userApiService.getPaginated tự động unwrap ApiResponse)
    const pagedList = await userApiService.getPaginated(params);

    console.log('📥 [Loader] PagedList:', pagedList);

    // Backend đã trả về UserNoPass (không có password)
    let users: UserNoPass[] = pagedList.items || [];

    // Filter theo role ở client-side (backend không hỗ trợ role filter trong query params)
    if (search.role !== undefined) {
      users = users.filter((user: UserNoPass) => user.role === search.role);
    }

    console.log('✅ [Loader] Successfully loaded users:', users.length, 'total:', pagedList.totalCount);

    return {
      users,
      total: pagedList.totalCount || users.length,
    };
  } catch (error: unknown) {
    console.error('❌ [Loader] Exception caught:', error);

    // Log chi tiết error nếu có
    if (error && typeof error === 'object') {
      if ('message' in error) {
        console.error('❌ [Loader] Error message:', error.message);
      }
      if ('response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error('❌ [Loader] Axios error response data:', axiosError.response?.data);
        console.error('❌ [Loader] Axios error status:', axiosError.response?.status);
      }
      if ('stack' in error) {
        console.error('❌ [Loader] Error stack:', error.stack);
      }
    }

    return {
      users: [],
      total: 0,
    };
  }
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------

export const userAdminDefinition: ManagementRouteDefinition<
  UserLoaderData,     // Kiểu loader data
  UserSearch,         // Kiểu search params
  { apiClient: never }  // Kiểu router context (ví dụ)
> = {
  entityName: 'Người dùng',
  path: 'users',
  component: UserManagementPage,
  searchSchema: userSearchSchema,
  loader: (ctx) => fetchUsers(ctx),
};
```

**Điểm quan trọng**:
- Loader tự động chạy khi route được mount hoặc search params thay đổi
- Filter theo role được thực hiện ở client-side (backend không hỗ trợ)
- Error handling với fallback trả về empty array

### 2. API Hooks (Feature-specific)

**File**: `features/users/hooks/useUsers.ts`

```typescript
import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
  useApiCustomQuery,
} from '../../../hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import { userApiService } from '../api/UserApiService';
import type { UserEntity } from '../types/entity';
import type { CreateUserRequest, UpdateUserRequest } from '../types/api';
import type { PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'users';

/**
 * useUsers - GET all users (không phân trang)
 * 
 * @param params - Query params (filter, search, etc.)
 * @returns Query result với data là UserEntity[]
 */
export const useUsers = (params?: Record<string, unknown>) => {
  return useApiList<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useUsersPaginated - GET users với phân trang
 * 
 * @param params - PagedRequest
 * @returns Query result với data là PagedList<UserEntity>
 */
export const useUsersPaginated = (params?: PagedRequest) => {
  return useApiPaginated<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    params,
  });
};

/**
 * useUser - GET user by ID
 * 
 * @param id - User ID
 * @returns Query result với data là UserEntity
 */
export const useUser = (id: string | number) => {
  return useApiDetail<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    id,
  });
};

/**
 * useCreateUser - POST create user
 * 
 * @param options - TanStack Query mutation options
 * @returns Mutation result
 */
export const useCreateUser = (options?: Parameters<typeof useApiCreate<UserEntity, CreateUserRequest>>[0]['options']) => {
  return useApiCreate<UserEntity, CreateUserRequest>({
    apiService: userApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useUpdateUser - PUT update user
 * 
 * @param options - TanStack Query mutation options
 * @returns Mutation result
 */
export const useUpdateUser = (options?: Parameters<typeof useApiUpdate<UserEntity, UpdateUserRequest>>[0]['options']) => {
  return useApiUpdate<UserEntity, UpdateUserRequest>({
    apiService: userApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useDeleteUser - DELETE user
 * 
 * @param options - TanStack Query mutation options
 * @returns Mutation result
 */
export const useDeleteUser = (options?: Parameters<typeof useApiDelete<UserEntity>>[0]['options']) => {
  return useApiDelete<UserEntity>({
    apiService: userApiService,
    entity: ENTITY,
    options,
  });
};

/**
 * useStaffUsers - GET staff users (dùng cho dropdown)
 * 
 * @param params - Pagination params
 * @returns Query result với data là UserEntity[]
 */
export const useStaffUsers = (params?: PagedRequest) => {
  return useQuery<UserEntity[]>({
    queryKey: [ENTITY, 'staff', params],
    queryFn: () => userApiService.getStaffUsers(params),
  });
};

/**
 * useCheckUsernameExists - Check username exists
 * 
 * @param username - Username cần kiểm tra
 * @returns Query result với data là boolean
 */
export const useCheckUsernameExists = (username: string) => {
  return useQuery<boolean>({
    queryKey: [ENTITY, 'check-username', username],
    queryFn: () => userApiService.checkUsernameExists(username),
    enabled: username.length > 0,
  });
};
```

**Điểm quan trọng**:
- Wraps generic `useApi` hooks với entity-specific types
- Tất cả hooks đều sử dụng `userApiService` singleton instance
- Custom hooks như `useStaffUsers` và `useCheckUsernameExists` sử dụng `useQuery` trực tiếp

### 3. Custom Hook (Business Logic)

**File**: `features/users/hooks/useUserManagementPage.ts`

```typescript
import { useState } from 'react'
import { Form, message } from 'antd'
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
import type { UserSearch } from '../../../app/routes/modules/management/definition/users.definition'
import { useCreateUser, useUpdateUser, useDeleteUser } from './useUsers'
import type { UserNoPass } from '../types/entity'
import type { UpdateUserRequest } from '../types/api'

export const useUserManagementPage = () => {
    // Route API với search params trên URL
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.USERS)
    const { users: usersData, total: totalUsers } = routeApi.useLoaderData() || { users: [], total: 0 }
    const search = routeApi.useSearch()
    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.USERS })
    const router = useRouter()

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false)
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
    const [notificationMessage, setNotificationMessage] = useState<string>('')
    const [editingUser, setEditingUser] = useState<UserNoPass | null>(null)
    const [deletingUser, setDeletingUser] = useState<UserNoPass | null>(null)
    const [form] = Form.useForm()

    // Mutation hooks
    const createUser = useCreateUser({
        onSuccess: (data) => {
            console.log('✅ [CreateUser] Success:', data)
            form.resetFields()
            setIsModalVisible(false)
            setEditingUser(null)
            // Show success notification modal
            setNotificationType('success')
            setNotificationMessage('Thêm người dùng thành công!')
            setIsNotificationModalVisible(true)
            // Refetch route loader data
            router.invalidate()
        },
        onError: (error: Error) => {
            console.error('❌ [CreateUser] Error:', error)
            // Show error notification modal
            setNotificationType('error')
            setNotificationMessage(error.message || 'Không thể tạo người dùng mới')
            setIsNotificationModalVisible(true)
        },
    })

    const updateUser = useUpdateUser({
        onSuccess: (data) => {
            console.log('✅ [UpdateUser] Success:', data)
            form.resetFields()
            setIsModalVisible(false)
            setEditingUser(null)
            // Show success notification modal
            setNotificationType('success')
            setNotificationMessage('Cập nhật người dùng thành công!')
            setIsNotificationModalVisible(true)
            // Refetch route loader data
            router.invalidate()
        },
        onError: (error: Error) => {
            console.error('❌ [UpdateUser] Error:', error)
            // Show error notification modal
            setNotificationType('error')
            setNotificationMessage(error.message || 'Không thể cập nhật người dùng')
            setIsNotificationModalVisible(true)
        },
    })

    const deleteUser = useDeleteUser({
        onSuccess: () => {
            message.success('Xóa người dùng thành công!')
            setIsDeleteModalVisible(false)
            setDeletingUser(null)
            // Refetch route loader data
            router.invalidate()
        },
        onError: (error: Error) => {
            message.error(error.message || 'Không thể xóa người dùng')
        },
    })

    // Search/Filter/Sort đọc từ URL (TanStack Router Query)
    const searchText = search?.search || ''
    const roleFilter = (search as UserSearch | undefined)?.role
    const sortField = (search as UserSearch | undefined)?.sortField || 'createdAt'
    const sortOrder = (search as UserSearch | undefined)?.sortOrder || 'descend'

    const showModal = () => {
        setEditingUser(null)
        setIsModalVisible(true)
        // Reset form completely
        setTimeout(() => {
            form.resetFields()
        }, 0)
    }

    const showEditModal = (user: UserNoPass) => {
        setEditingUser(user)
        setIsModalVisible(true)
        form.setFieldsValue(user)
    }

    const showDeleteModal = (user: UserNoPass) => {
        setDeletingUser(user)
        setIsDeleteModalVisible(true)
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            console.log('✅ [Form] Validation passed. Form Values:', values)

            if (editingUser) {
                // Update user
                // Xử lý password: theo tài liệu, password là optional, nullable
                // - Nếu null hoặc empty string → không đổi password
                // - Nếu có giá trị → đổi password
                const updateData: UpdateUserRequest = {
                    id: editingUser.id,
                    username: values.username,
                    fullName: values.fullName,
                    role: values.role,
                    // Nếu password undefined hoặc empty → gửi null (không đổi password)
                    // Nếu password có giá trị → gửi giá trị đó (đổi password)
                    password: (values.password === undefined || values.password === '')
                        ? null
                        : values.password,
                }

                console.log('📤 [UpdateUser] Calling mutation with:', { id: editingUser.id, data: updateData })
                console.log('📤 [UpdateUser] Mutation state:', { isPending: updateUser.isPending, isError: updateUser.isError })

                updateUser.mutate({ id: editingUser.id, data: updateData })
            } else {
                // Add new user
                console.log('📤 [CreateUser] Calling mutation with:', values)
                createUser.mutate(values)
            }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) {
                // Form validation errors
                console.log('Validate Failed:', error)
            } else {
                // API errors - đã được handle trong onError của mutation hooks
                console.error('API Error:', error)
            }
        }
    }

    const handleDelete = async () => {
        if (deletingUser) {
            deleteUser.mutate(deletingUser.id)
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setEditingUser(null)
        form.resetFields()
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false)
        setDeletingUser(null)
    }

    const handleNotificationClose = () => {
        setIsNotificationModalVisible(false)
        setNotificationMessage('')
    }

    // Search, Filter, Sort handlers (giống Mock page)
    const handleSearch = (value: string) => {
        navigate({
            search: (prev: UserSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleRoleFilter = (value: number | undefined) => {
        navigate({
            search: (prev: UserSearch) => ({
                ...prev,
                role: value,
                page: 1,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: UserSearch) => ({
                ...prev,
                sortField: field,
                sortOrder: order,
            }),
        })
    }

    const clearFilters = () => {
        navigate({
            search: {
                page: 1,
                pageSize: 10,
                search: undefined,
                role: undefined,
                sortField: 'createdAt',
                sortOrder: 'descend',
            },
        })
    }

    // Statistics (tính từ API data - đã được filter/sort ở backend)
    const users: UserNoPass[] = usersData || []
    const adminCount = users.filter((user: UserNoPass) => user.role === 0).length
    const staffCount = users.filter((user: UserNoPass) => user.role === 1).length

    return {
        // Data
        users,
        totalUsers: totalUsers ?? users.length,
        adminCount,
        staffCount,

        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        isNotificationModalVisible,
        notificationType,
        notificationMessage,
        editingUser,
        deletingUser,
        form,

        // Search/Filter states
        searchText,
        roleFilter,
        sortField,
        sortOrder,

        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleNotificationClose,
        handleSearch,
        handleRoleFilter,
        handleSort,
        clearFilters,
    }
}
```

**Điểm quan trọng**:
- Tập trung tất cả business logic vào một hook
- Sử dụng `router.invalidate()` để refetch loader sau mutation
- Password handling đặc biệt: null = không đổi, có giá trị = đổi password
- Search/filter/sort state được lưu trong URL

### 4. Page Component

**File**: `features/users/pages/UserManagementPage.tsx`

```typescript
import { Space } from 'antd'
import { UserHeader } from '../components/UserHeader'
import { UserStatistics } from '../components/UserStatistics'
import { UserSearchFilter } from '../components/UserSearchFilter'
import { UserTable } from '../components/UserTable'
import { UserModals } from '../components/UserModals'
import { useUserManagementPage } from '../hooks/useUserManagementPage'


export function UserManagementPage() {
    const {
        // Data
        users,
        totalUsers,
        adminCount,
        staffCount,

        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        isNotificationModalVisible,
        notificationType,
        notificationMessage,
        editingUser,
        deletingUser,
        form,

        // Search/Filter states
        searchText,
        roleFilter,
        sortField,
        sortOrder,

        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleNotificationClose,
        handleSearch,
        handleRoleFilter,
        handleSort,
        clearFilters,
    } = useUserManagementPage()

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <UserHeader onAddUser={showModal} />

                {/* Statistics */}
                <UserStatistics
                    totalUsers={totalUsers}
                    adminCount={adminCount}
                    staffCount={staffCount}
                />

                {/* Search and Filter Controls */}
                <UserSearchFilter
                    searchText={searchText}
                    roleFilter={roleFilter}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSearchChange={handleSearch}
                    onRoleFilterChange={handleRoleFilter}
                    onSortChange={handleSort}
                    onClearFilters={clearFilters}
                />

                {/* Table */}
                <UserTable
                    users={users}
                    onEditUser={showEditModal}
                    onDeleteUser={showDeleteModal}
                />
            </Space>

            {/* Modals */}
            <UserModals
                isModalVisible={isModalVisible}
                isDeleteModalVisible={isDeleteModalVisible}
                isNotificationModalVisible={isNotificationModalVisible}
                notificationType={notificationType}
                notificationMessage={notificationMessage}
                editingUser={editingUser}
                deletingUser={deletingUser}
                form={form}
                onModalOk={handleOk}
                onModalCancel={handleCancel}
                onDeleteOk={handleDelete}
                onDeleteCancel={handleDeleteCancel}
                onNotificationClose={handleNotificationClose}
            />
        </div>
    )
}
```

**Điểm quan trọng**:
- Pure presentation component, không có business logic
- Destructure tất cả từ custom hook
- Layout với Ant Design `Space` component
- Modals được render ở cuối, ngoài `Space` container

### 5. Header Component

**File**: `features/users/components/UserHeader.tsx`

```typescript
import { Button, Card, Row, Col, Space, Typography } from 'antd'
import { PlusOutlined, TeamOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface UserHeaderProps {
    onAddUser: () => void
}

export const UserHeader = ({ onAddUser }: UserHeaderProps) => {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size="small">
                        <Title
                            level={2}
                            style={{ margin: 0, color: '#1890ff' }}
                        >
                            <TeamOutlined style={{ marginRight: '8px' }} />
                            Quản lý người dùng
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin và quyền hạn của người dùng trong
                            hệ thống
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={onAddUser}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Thêm
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}
```

**Điểm quan trọng**:
- Simple presentational component
- Sử dụng Ant Design `Card`, `Row`, `Col` cho layout
- Icon + Title + Description pattern
- Primary action button với custom styling

### 6. Statistics Component

**File**: `features/users/components/UserStatistics.tsx`

```typescript
import { Card, Row, Col, Statistic } from 'antd'
import { TeamOutlined, CrownOutlined, UserOutlined } from '@ant-design/icons'

interface UserStatisticsProps {
    totalUsers: number
    adminCount: number
    staffCount: number
}

export const UserStatistics = ({
    totalUsers,
    adminCount,
    staffCount,
}: UserStatisticsProps) => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Tổng người dùng (trên bảng)"
                        value={totalUsers}
                        prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Quản trị viên (trên bảng)"
                        value={adminCount}
                        prefix={<CrownOutlined style={{ color: '#faad14' }} />}
                        valueStyle={{ color: '#faad14' }}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        border: 'none',
                    }}
                >
                    <Statistic
                        title="Nhân viên (trên bảng)"
                        value={staffCount}
                        prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
        </Row>
    )
}
```

**Điểm quan trọng**:
- Sử dụng Ant Design `Statistic` component
- Mỗi statistic trong một `Card` riêng
- Grid layout với `Row` và `Col` (span={8} = 3 columns)
- Color coding cho từng loại statistic

### 7. Search Filter Component

**File**: `features/users/components/UserSearchFilter.tsx`

```typescript
import { Card, Row, Col, Space, Typography, Input, Select, Button } from 'antd'
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
} from '@ant-design/icons'

const { Text } = Typography

interface UserSearchFilterProps {
    searchText: string
    roleFilter: number | undefined
    sortField: string
    sortOrder: 'ascend' | 'descend'
    onSearchChange: (value: string) => void
    onRoleFilterChange: (value: number | undefined) => void
    onSortChange: (field: string, order: 'ascend' | 'descend') => void
    onClearFilters: () => void
}

export const UserSearchFilter = ({
    searchText,
    roleFilter,
    sortField,
    sortOrder,
    onSearchChange,
    onRoleFilterChange,
    onSortChange,
    onClearFilters,
}: UserSearchFilterProps) => {
    const handleSortChange = (value: string) => {
        const [field, order] = value.split('-')
        onSortChange(field, order as 'ascend' | 'descend')
    }

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row gutter={16} align="middle">
                <Col span={8}>
                    <Space>
                        <SearchOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Tìm kiếm:</Text>
                    </Space>
                    <Input.Search
                        placeholder="Tìm theo tên hoặc username..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ marginTop: '8px' }}
                        allowClear
                    />
                </Col>
                <Col span={6}>
                    <Space>
                        <FilterOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Vai trò:</Text>
                    </Space>
                    <Select
                        placeholder="Tất cả vai trò"
                        value={roleFilter}
                        onChange={onRoleFilterChange}
                        style={{ width: '100%', marginTop: '8px' }}
                        allowClear
                    >
                        <Select.Option value={0}>Admin</Select.Option>
                        <Select.Option value={1}>Staff</Select.Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <Space>
                        <SortAscendingOutlined style={{ color: '#1890ff' }} />
                        <Text strong>Sắp xếp:</Text>
                    </Space>
                    <Select
                        value={`${sortField}-${sortOrder}`}
                        onChange={handleSortChange}
                        style={{ width: '100%', marginTop: '8px' }}
                    >
                        <Select.Option value="createdAt-descend">
                            Mới nhất
                        </Select.Option>
                        <Select.Option value="createdAt-ascend">
                            Cũ nhất
                        </Select.Option>
                        <Select.Option value="fullName-ascend">
                            Tên A-Z
                        </Select.Option>
                        <Select.Option value="fullName-descend">
                            Tên Z-A
                        </Select.Option>
                        <Select.Option value="username-ascend">
                            Username A-Z
                        </Select.Option>
                        <Select.Option value="username-descend">
                            Username Z-A
                        </Select.Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Button
                        onClick={onClearFilters}
                        style={{ marginTop: '32px' }}
                        block
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}
```

**Điểm quan trọng**:
- Controlled components (value + onChange)
- Sort field và order được combine thành một string (`field-order`) để dễ quản lý
- Clear filters button để reset về default
- Grid layout với responsive columns

### 8. Table Component

**File**: `features/users/components/UserTable.tsx`

```typescript
import {
    Table,
    Card,
    Space,
    Typography,
    Tag,
    Avatar,
    Button,
    Tooltip,
} from 'antd'
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    CrownOutlined,
} from '@ant-design/icons'
import type { UserNoPass } from '../types/entity'

const { Text } = Typography

interface UserTableProps {
    users: UserNoPass[]
    onEditUser: (user: UserNoPass) => void
    onDeleteUser: (user: UserNoPass) => void
}

export const UserTable = ({
    users,
    onEditUser,
    onDeleteUser,
}: UserTableProps) => {
    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (record: UserNoPass) => (
                <Space>
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor:
                                record.role === 0 ? '#faad14' : '#52c41a',
                            border: '2px solid #fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>
                            {record.fullName}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            @{record.username}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: number) => (
                <Tag
                    color={role === 0 ? 'gold' : 'green'}
                    icon={role === 0 ? <CrownOutlined /> : <UserOutlined />}
                    style={{ borderRadius: '12px', padding: '4px 12px' }}
                >
                    {role === 0 ? 'Admin' : 'Staff'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => (
                <Text type="secondary">
                    {new Date(date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: UserNoPass) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEditUser(record)}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => onDeleteUser(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} người dùng`,
                    style: { marginTop: '16px' },
                }}
                style={{
                    borderRadius: '8px',
                }}
            />
        </Card>
    )
}
```

**Điểm quan trọng**:
- Custom render functions cho các columns
- Avatar với color coding theo role
- Date formatting với `toLocaleDateString`
- Action buttons với icons và tooltips
- Pagination configuration

### 9. Modals Component

**File**: `features/users/components/UserModals.tsx`

```typescript
import { Modal, Space } from 'antd'
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { UserForm } from './UserForm'
import type { UserNoPass } from '../types/entity'
import type { FormInstance } from 'antd/es/form'

interface UserModalsProps {
    isModalVisible: boolean
    isDeleteModalVisible: boolean
    isNotificationModalVisible: boolean
    notificationType: 'success' | 'error'
    notificationMessage: string
    editingUser: UserNoPass | null
    deletingUser: UserNoPass | null
    form: FormInstance
    onModalOk: () => void
    onModalCancel: () => void
    onDeleteOk: () => void
    onDeleteCancel: () => void
    onNotificationClose: () => void
}

export const UserModals = ({
    isModalVisible,
    isDeleteModalVisible,
    isNotificationModalVisible,
    notificationType,
    notificationMessage,
    editingUser,
    deletingUser,
    form,
    onModalOk,
    onModalCancel,
    onDeleteOk,
    onDeleteCancel,
    onNotificationClose,
}: UserModalsProps) => {
    return (
        <>
            {/* Add/Edit Modal */}
            <Modal
                title={
                    <Space>
                        <PlusOutlined style={{ color: '#1890ff' }} />
                        <span>
                            {editingUser
                                ? 'Chỉnh sửa người dùng'
                                : 'Thêm người dùng mới'}
                        </span>
                    </Space>
                }
                open={isModalVisible}
                onOk={onModalOk}
                onCancel={onModalCancel}
                width={600}
                okText={editingUser ? 'Cập nhật' : 'Tạo người dùng'}
                cancelText="Hủy"
                okButtonProps={{
                    style: { borderRadius: '8px' },
                }}
                cancelButtonProps={{
                    style: { borderRadius: '8px' },
                }}
            >
                <UserForm
                    key={editingUser ? `edit-${editingUser.id}` : 'add-new'}
                    form={form}
                    isEdit={!!editingUser}
                    initialValues={editingUser || undefined}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalVisible}
                onOk={onDeleteOk}
                onCancel={onDeleteCancel}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{
                    danger: true,
                    style: { borderRadius: '8px' },
                }}
                cancelButtonProps={{
                    style: { borderRadius: '8px' },
                }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa người dùng{' '}
                    <strong>{deletingUser?.fullName}</strong> không?
                </p>
                <p>Hành động này không thể hoàn tác.</p>
            </Modal>

            {/* Notification Modal (Success/Error) */}
            <Modal
                title={
                    <Space>
                        {notificationType === 'success' ? (
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                        ) : (
                            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
                        )}
                        <span>
                            {notificationType === 'success' ? 'Thành công' : 'Lỗi'}
                        </span>
                    </Space>
                }
                open={isNotificationModalVisible}
                onOk={onNotificationClose}
                onCancel={onNotificationClose}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{
                    style: { borderRadius: '8px' },
                    type: notificationType === 'success' ? 'primary' : 'default',
                }}
                width={400}
            >
                <p style={{ marginTop: '16px', fontSize: '16px' }}>{notificationMessage}</p>
            </Modal>
        </>
    )
}
```

**Điểm quan trọng**:
- Group tất cả modals vào một component
- Conditional rendering dựa trên state
- UserForm được sử dụng bên trong Add/Edit Modal
- Key prop trên UserForm để force re-render khi chuyển mode
- Notification modal với dynamic icon và color

### 10. Form Component

**File**: `features/users/components/UserForm.tsx`

```typescript
import { Form, Input, Select } from 'antd'
import type { UserNoPass } from '../types/entity'

import type { FormInstance } from 'antd/es/form'

interface UserFormProps {
    form: FormInstance
    isEdit?: boolean
    initialValues?: UserNoPass
}

const { Option } = Select

export const UserForm = ({
    form,
    isEdit = false,
    initialValues,
}: UserFormProps) => {
    return (
        <Form
            form={form}
            layout="vertical"
            name="user_form"
            initialValues={initialValues}
            preserve={false}
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[
                    { required: true, message: 'Vui lòng nhập username!' },
                    { min: 3, message: 'Username phải có ít nhất 3 ký tự!' },
                ]}
            >
                <Input disabled={isEdit} />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    { required: !isEdit, message: 'Vui lòng nhập password!' },
                    // Chỉ validate min length nếu password có giá trị (không phải empty)
                    {
                        validator(_, value) {
                            if (!value || value.length === 0) {
                                // Empty password trong edit mode là OK (không đổi password)
                                return Promise.resolve()
                            }
                            if (value.length < 6) {
                                return Promise.reject(new Error('Password phải có ít nhất 6 ký tự!'))
                            }
                            return Promise.resolve()
                        },
                    },
                ]}
            >
                <Input.Password
                    placeholder={
                        isEdit
                            ? 'Để trống nếu không muốn đổi mật khẩu'
                            : 'Nhập mật khẩu'
                    }
                />
            </Form.Item>

            <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                initialValue={undefined}
            >
                <Select placeholder="Chọn vai trò" allowClear>
                    <Option value={0}>Admin</Option>
                    <Option value={1}>Staff</Option>
                </Select>
            </Form.Item>
        </Form>
    )
}
```

**Điểm quan trọng**:
- Sử dụng Ant Design `Form` với `layout="vertical"`
- Conditional validation: password required chỉ khi `!isEdit`
- Custom validator cho password: empty trong edit mode = OK
- Username disabled trong edit mode
- `preserve={false}` để không giữ form state khi unmount

---

## Pattern và Best Practices

### 1. Separation of Concerns

- **Page Component**: Chỉ render, không có logic
- **Custom Hook**: Tất cả business logic
- **Components**: Pure UI components, nhận props và callbacks

### 2. State Management Strategy

- **URL State**: Search, filter, sort, pagination → lưu trong URL (TanStack Router search params)
- **Local State**: Modal visibility, form state, notification state → `useState`
- **Server State**: Data từ API → TanStack Router Loader (fetch qua `userApiService`)
- **Cache Management**: TanStack Query tự động cache và invalidate queries

### 3. Data Flow

#### Read Operations (Search/Filter/Sort)
```
User Action (Search/Filter/Sort)
    ↓
Handler in Hook (handleSearch/handleFilter/handleSort)
    ↓
navigate() - Update URL search params
    ↓
TanStack Router detects URL change
    ↓
Route Loader (fetchUsers) re-runs
    ↓
userApiService.getPaginated() → BaseApiService → axios.get()
    ↓
unwrapResponse() → PagedList<UserEntity>
    ↓
Loader returns { users, total }
    ↓
routeApi.useLoaderData() returns new data
    ↓
UI updates automatically
```

#### Write Operations (Create/Update/Delete)
```
User Action (Submit Form/Delete)
    ↓
Handler in Hook (handleOk/handleDelete)
    ↓
Form validation (form.validateFields())
    ↓
Call mutation hook (createUser.mutate() / updateUser.mutate() / deleteUser.mutate())
    ↓
useApiCreate/Update/Delete → useMutation → BaseApiService → axios.post/put/delete()
    ↓
unwrapResponse() → Success/Error
    ↓
onSuccess callback:
    - Invalidate TanStack Query cache (automatic)
    - router.invalidate() → Refetch route loader
    - Update local state (close modal, show notification)
    ↓
UI updates automatically
```

### 4. Error Handling

- **Form Validation**: Ant Design Form tự động handle
- **API Errors**: Xử lý trong mutation `onError` callback
- **User Feedback**: Sử dụng notification modal hoặc `message` từ Ant Design

### 5. Type Safety

- Định nghĩa types cho tất cả props
- Sử dụng TypeScript strict mode
- Type-safe routing với TanStack Router

### 6. Component Composition

- Tách nhỏ components theo chức năng
- Mỗi component có một responsibility rõ ràng
- Dễ test và maintain

### 7. API Service Architecture

**Phân lớp API Service**:

1. **BaseApiService** (`lib/api/base/BaseApiService.ts`):
   - Base class cho tất cả API services
   - Xử lý: `ApiResponse<T>` unwrapping, query params conversion (camelCase → PascalCase), error handling
   - Methods: `getAll()`, `getPaginated()`, `getById()`, `create()`, `update()`, `patch()`, `delete()`, `custom()`

2. **Entity-specific API Service** (ví dụ: `UserApiService`):
   - Extends `BaseApiService` với entity-specific types
   - Có thể thêm custom methods (ví dụ: `getStaffUsers()`, `checkUsernameExists()`)
   - Singleton instance export

3. **API Hooks** (`useApi.ts`):
   - Generic hooks: `useApiList`, `useApiPaginated`, `useApiDetail`, `useApiCreate`, `useApiUpdate`, `useApiDelete`
   - Tự động tạo query keys, manage cache, invalidate queries
   - Wraps TanStack Query `useQuery` và `useMutation`

4. **Feature-specific Hooks** (ví dụ: `useUsers.ts`):
   - Wraps generic `useApi` hooks với entity-specific types
   - Exports: `useUsers`, `useUsersPaginated`, `useUser`, `useCreateUser`, `useUpdateUser`, `useDeleteUser`

**Luồng API Call**:
```
Feature Hook (useCreateUser)
    ↓
Generic Hook (useApiCreate)
    ↓
TanStack Query (useMutation)
    ↓
API Service (userApiService.create)
    ↓
BaseApiService (create method)
    ↓
Axios (axios.post)
    ↓
API Response Adapter (unwrapResponse)
    ↓
Return Data (UserEntity)
```

---

## Code Examples

### Example 1: Tạo Page Mới (ProductManagementPage)

#### Step 1: Tạo API Service

```typescript
// features/products/api/ProductApiService.ts
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
}

// Export singleton instance
export const productApiService = new ProductApiService();
```

#### Step 2: Tạo API Hooks

```typescript
// features/products/api/useProducts.ts
import {
  useApiList,
  useApiPaginated,
  useApiDetail,
  useApiCreate,
  useApiUpdate,
  useApiDelete,
} from '../../../hooks/useApi';
import { productApiService } from './ProductApiService';
import type { ProductEntity } from '../types/entity';
import type { CreateProductRequest, UpdateProductRequest } from '../types/api';
import type { PagedRequest } from '../../../lib/api/types/api.types';

const ENTITY = 'products';

export const useProducts = (params?: Record<string, unknown>) => {
  return useApiList<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    params,
  });
};

export const useProductsPaginated = (params?: PagedRequest) => {
  return useApiPaginated<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    params,
  });
};

export const useProduct = (id: string | number) => {
  return useApiDetail<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    id,
  });
};

export const useCreateProduct = (options?: Parameters<typeof useApiCreate<ProductEntity, CreateProductRequest>>[0]['options']) => {
  return useApiCreate<ProductEntity, CreateProductRequest>({
    apiService: productApiService,
    entity: ENTITY,
    options,
  });
};

export const useUpdateProduct = (options?: Parameters<typeof useApiUpdate<ProductEntity, UpdateProductRequest>>[0]['options']) => {
  return useApiUpdate<ProductEntity, UpdateProductRequest>({
    apiService: productApiService,
    entity: ENTITY,
    options,
  });
};

export const useDeleteProduct = (options?: Parameters<typeof useApiDelete<ProductEntity>>[0]['options']) => {
  return useApiDelete<ProductEntity>({
    apiService: productApiService,
    entity: ENTITY,
    options,
  });
};
```

#### Step 3: Tạo Route Definition với Loader

```typescript
// app/routes/modules/management/definition/products.definition.ts
import { z } from 'zod';
import { baseSearchSchema, type ManagementRouteDefinition, type LoaderContext } from '../../../type/types';
import { ProductManagementPage } from '../../../../../features/products/pages/ProductManagementPage.tsx';
import { productApiService } from '../../../../../features/products/api';
import type { Product } from '../../../../../features/products/types/entity.ts';
import type { PagedRequest } from '../../../../../lib/api/types/api.types';

interface ProductLoaderData {
  products: Product[];
  total: number;
}

const productSearchSchema = baseSearchSchema.extend({
  categoryId: z.number().optional(),
  sortField: z.string().catch('createdAt'),
  sortOrder: z.enum(['ascend', 'descend']).catch('descend'),
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

async function fetchProducts(ctx: LoaderContext<Record<string, never>, ProductSearch, { apiClient: never }>): Promise<ProductLoaderData> {
  const search = ctx.search;
  
  const params: PagedRequest = {
    page: search.page || 1,
    pageSize: search.pageSize || 10,
    search: search.search,
    sortBy: search.sortField === 'createdAt' ? 'CreatedAt' : 'Name',
    sortDesc: search.sortOrder === 'descend',
  };

  const pagedList = await productApiService.getPaginated(params);
  let products: Product[] = pagedList.items || [];

  // Client-side filter nếu cần
  if (search.categoryId !== undefined) {
    products = products.filter((p: Product) => p.categoryId === search.categoryId);
  }

  return {
    products,
    total: pagedList.totalCount || products.length,
  };
}

export const productAdminDefinition: ManagementRouteDefinition<
  ProductLoaderData,
  ProductSearch,
  { apiClient: never }
> = {
  entityName: 'Sản phẩm',
  path: 'products',
  component: ProductManagementPage,
  searchSchema: productSearchSchema,
  loader: (ctx) => fetchProducts(ctx),
};
```

#### Step 4: Tạo Custom Hook

```typescript
// features/products/hooks/useProductManagementPage.ts
import { useState } from 'react'
import { Form } from 'antd'
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
import type { ProductSearch } from '../../../app/routes/modules/management/definition/products.definition'
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '../api/useProducts'
import type { Product } from '../types/entity'
import type { UpdateProductRequest } from '../types/api'

export const useProductManagementPage = () => {
    // Route API
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.PRODUCTS)
    const { products: productsData, total: totalProducts } = routeApi.useLoaderData() || { products: [], total: 0 }
    const search = routeApi.useSearch()
    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.PRODUCTS })
    const router = useRouter()

    // Local state
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false)
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success')
    const [notificationMessage, setNotificationMessage] = useState<string>('')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
    const [form] = Form.useForm()

    // Mutation hooks
    const createProduct = useCreateProduct({
        onSuccess: () => {
            form.resetFields()
            setIsModalVisible(false)
            setEditingProduct(null)
            setNotificationType('success')
            setNotificationMessage('Thêm sản phẩm thành công!')
            setIsNotificationModalVisible(true)
            router.invalidate()
        },
        onError: (error: Error) => {
            setNotificationType('error')
            setNotificationMessage(error.message || 'Không thể tạo sản phẩm mới')
            setIsNotificationModalVisible(true)
        },
    })

    // ... (tương tự cho update và delete)

    // Search/Filter/Sort
    const searchText = search?.search || ''
    const categoryFilter = (search as ProductSearch | undefined)?.categoryId
    const sortField = (search as ProductSearch | undefined)?.sortField || 'createdAt'
    const sortOrder = (search as ProductSearch | undefined)?.sortOrder || 'descend'

    // Handlers
    const showModal = () => {
        setEditingProduct(null)
        setIsModalVisible(true)
        setTimeout(() => {
            form.resetFields()
        }, 0)
    }

    const showEditModal = (product: Product) => {
        setEditingProduct(product)
        setIsModalVisible(true)
        form.setFieldsValue(product)
    }

    const showDeleteModal = (product: Product) => {
        setDeletingProduct(product)
        setIsDeleteModalVisible(true)
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            if (editingProduct) {
                const updateData: UpdateProductRequest = {
                    id: editingProduct.id,
                    ...values,
                }
                updateProduct.mutate({ id: editingProduct.id, data: updateData })
            } else {
                createProduct.mutate(values)
            }
        } catch (error) {
            // Validation errors
        }
    }

    const handleDelete = async () => {
        if (deletingProduct) {
            deleteProduct.mutate(deletingProduct.id)
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setEditingProduct(null)
        form.resetFields()
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false)
        setDeletingProduct(null)
    }

    const handleNotificationClose = () => {
        setIsNotificationModalVisible(false)
        setNotificationMessage('')
    }

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleCategoryFilter = (value: number | undefined) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                categoryId: value,
                page: 1,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                sortField: field,
                sortOrder: order,
            }),
        })
    }

    const clearFilters = () => {
        navigate({
            search: {
                page: 1,
                pageSize: 10,
                search: undefined,
                categoryId: undefined,
                sortField: 'createdAt',
                sortOrder: 'descend',
            },
        })
    }

    // Statistics
    const products: Product[] = productsData || []
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const lowStockCount = products.filter((p) => p.stock < 10).length

    return {
        // Data
        products,
        totalProducts: totalProducts ?? products.length,
        totalStock,
        lowStockCount,

        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        isNotificationModalVisible,
        notificationType,
        notificationMessage,
        editingProduct,
        deletingProduct,
        form,

        // Search/Filter states
        searchText,
        categoryFilter,
        sortField,
        sortOrder,

        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleNotificationClose,
        handleSearch,
        handleCategoryFilter,
        handleSort,
        clearFilters,
    }
}
```

#### Step 2: Tạo Page Component

```typescript
// features/products/pages/ProductManagementPage.tsx
import { Space } from 'antd'
import { ProductHeader } from '../components/ProductHeader'
import { ProductStatistics } from '../components/ProductStatistics'
import { ProductSearchFilter } from '../components/ProductSearchFilter'
import { ProductTable } from '../components/ProductTable'
import { ProductModals } from '../components/ProductModals'
import { useProductManagementPage } from '../hooks/useProductManagementPage'

export function ProductManagementPage() {
    const {
        // Data
        products,
        totalProducts,
        totalStock,
        lowStockCount,

        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        isNotificationModalVisible,
        notificationType,
        notificationMessage,
        editingProduct,
        deletingProduct,
        form,

        // Search/Filter states
        searchText,
        categoryFilter,
        sortField,
        sortOrder,

        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleNotificationClose,
        handleSearch,
        handleCategoryFilter,
        handleSort,
        clearFilters,
    } = useProductManagementPage()

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <ProductHeader onAddProduct={showModal} />

                {/* Statistics */}
                <ProductStatistics
                    totalProducts={totalProducts}
                    totalStock={totalStock}
                    lowStockCount={lowStockCount}
                />

                {/* Search and Filter Controls */}
                <ProductSearchFilter
                    searchText={searchText}
                    categoryFilter={categoryFilter}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSearchChange={handleSearch}
                    onCategoryFilterChange={handleCategoryFilter}
                    onSortChange={handleSort}
                    onClearFilters={clearFilters}
                />

                {/* Table */}
                <ProductTable
                    products={products}
                    onEditProduct={showEditModal}
                    onDeleteProduct={showDeleteModal}
                />
            </Space>

            {/* Modals */}
            <ProductModals
                isModalVisible={isModalVisible}
                isDeleteModalVisible={isDeleteModalVisible}
                isNotificationModalVisible={isNotificationModalVisible}
                notificationType={notificationType}
                notificationMessage={notificationMessage}
                editingProduct={editingProduct}
                deletingProduct={deletingProduct}
                form={form}
                onModalOk={handleOk}
                onModalCancel={handleCancel}
                onDeleteOk={handleDelete}
                onDeleteCancel={handleDeleteCancel}
                onNotificationClose={handleNotificationClose}
            />
        </div>
    )
}
```

### Example 2: Component Template

#### Header Component Template

```typescript
import { Button, Card, Row, Col, Space, Typography } from 'antd'
import { PlusOutlined, [EntityIcon]Outlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface [Entity]HeaderProps {
    onAdd[Entity]: () => void
}

export const [Entity]Header = ({ onAdd[Entity] }: [Entity]HeaderProps) => {
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size="small">
                        <Title
                            level={2}
                            style={{ margin: 0, color: '#1890ff' }}
                        >
                            <[EntityIcon]Outlined style={{ marginRight: '8px' }} />
                            Quản lý [Entity Name]
                        </Title>
                        <Text type="secondary">
                            [Description]
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={onAdd[Entity]}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Thêm
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}
```

---

## Hướng Dẫn Áp Dụng

### Checklist Khi Tạo Page Mới

#### 1. Setup Cơ Bản

- [ ] Tạo folder structure trong `features/[entity]/`
- [ ] Tạo types trong `types/entity.ts` và `types/api.ts`
- [ ] Tạo API service trong `api/[Entity]ApiService.ts` (extends `BaseApiService`)
- [ ] Tạo API hooks trong `api/use[Entity]s.ts` (wraps `useApiCreate/Update/Delete`)
- [ ] Setup route definition với loader trong `app/routes/modules/management/definition/[entity].definition.ts`
- [ ] Đăng ký route trong route tree

#### 2. Tạo Custom Hook

- [ ] Import route API: `getRouteApi(ENDPOINTS.ADMIN.[ENTITY])`
- [ ] Sử dụng `routeApi.useLoaderData()` để lấy data từ loader
- [ ] Sử dụng `routeApi.useSearch()` để lấy search params từ URL
- [ ] Setup `useNavigate` và `useRouter` cho navigation và invalidation
- [ ] Setup local state cho modals (`useState`)
- [ ] Setup form instance (`Form.useForm()`)
- [ ] Setup mutation hooks (`useCreate[Entity]`, `useUpdate[Entity]`, `useDelete[Entity]`) với onSuccess/onError
- [ ] Implement search/filter/sort handlers (update URL via `navigate()`)
- [ ] Implement form handlers (`handleOk`, `handleDelete`)
- [ ] Calculate statistics từ loaded data
- [ ] Return tất cả state và handlers

#### 3. Tạo Components

- [ ] `[Entity]Header.tsx` - Title và add button
- [ ] `[Entity]Statistics.tsx` - Statistics cards
- [ ] `[Entity]SearchFilter.tsx` - Search, filter, sort controls
- [ ] `[Entity]Table.tsx` - Data table với actions
- [ ] `[Entity]Modals.tsx` - Tất cả modals
- [ ] `[Entity]Form.tsx` - Form fields

#### 4. Tạo Page Component

- [ ] Import tất cả components
- [ ] Sử dụng custom hook
- [ ] Layout với `Space` và `div` container
- [ ] Truyền props xuống components
- [ ] Render modals ở cuối

#### 5. Testing

- [ ] Test add functionality
- [ ] Test edit functionality
- [ ] Test delete functionality
- [ ] Test search/filter/sort
- [ ] Test error handling
- [ ] Test form validation

### Common Pitfalls và Solutions

#### 1. Form không reset sau khi submit

**Vấn đề**: Form vẫn giữ giá trị sau khi submit thành công.

**Giải pháp**: 
```typescript
// Trong onSuccess callback
form.resetFields()
setIsModalVisible(false)
setEditingEntity(null)
```

#### 2. URL state không sync với UI

**Vấn đề**: Thay đổi filter nhưng UI không update.

**Giải pháp**: Đảm bảo đọc state từ URL:
```typescript
const search = routeApi.useSearch()
const searchText = search?.search || ''
```

#### 3. Data không refetch sau mutation

**Vấn đề**: Sau khi create/update, table không hiển thị data mới.

**Giải pháp**: 
- `useApiCreate/Update/Delete` tự động invalidate TanStack Query cache
- Cần thêm `router.invalidate()` trong `onSuccess` để refetch route loader:
```typescript
const createEntity = useCreateEntity({
    onSuccess: () => {
        // ... other logic
        router.invalidate() // Refetch route loader
    },
})
```

#### 4. Modal không đóng sau khi submit

**Vấn đề**: Modal vẫn mở sau khi submit thành công.

**Giải pháp**: Đảm bảo set state trong onSuccess:
```typescript
onSuccess: () => {
    setIsModalVisible(false)
    // ...
}
```

#### 5. Form validation không hoạt động

**Vấn đề**: Có thể submit form với dữ liệu không hợp lệ.

**Giải pháp**: Sử dụng `form.validateFields()`:
```typescript
const handleOk = async () => {
    try {
        const values = await form.validateFields()
        // Submit logic
    } catch (error) {
        // Validation errors
    }
}
```

---

## Kết Luận

Pattern `UserManagementPage` cung cấp một cấu trúc rõ ràng, dễ maintain và mở rộng cho các trang quản lý CRUD. Bằng cách tuân theo pattern này, bạn có thể:

- **Tăng tốc độ phát triển**: Template rõ ràng, dễ copy và adapt
- **Đảm bảo consistency**: Tất cả pages có cấu trúc giống nhau
- **Dễ maintain**: Logic tập trung, dễ debug và fix bugs
- **Type safety**: TypeScript đảm bảo type safety toàn bộ flow
- **Better UX**: URL state management cho phép bookmark và share

Khi tạo page mới, hãy tham khảo tài liệu này và follow checklist để đảm bảo không bỏ sót bất kỳ phần nào.


