# User Management Example — Generic Page Config (định hướng)

> Đây là bản hướng dẫn config/adapter, chưa refactor code. Sẽ dùng để chuyển `UserManagementPage` sang pattern Generic Page.

## Entity meta
- name: `users`
- displayName: `User`
- displayNamePlural: `Users`

## Table config (định hướng)
- Columns:
  - username (searchable, sortable)
  - fullName
  - role (render: Admin=0, Staff=1)
  - createdAt (sortable, format datetime)
- Row actions:
  - Edit → mở form với setFieldsValue(user)
  - Delete → popconfirm hoặc modal xác nhận
- Pagination/sort từ search params:
  - `page`, `pageSize`, `sortField`, `sortOrder`
- Default search params:
  - page=1, pageSize=10, sortField=`createdAt`, sortOrder=`descend`

## Filter/Search
- searchText → search param `search`
- roleFilter → search param `role` (0/1)
- clearFilters → reset search params về default

## Form config (create/update)
- Fields:
  - username: Input, required
  - fullName: Input, required
  - role: Select {0: Admin, 1: Staff}, required
  - password:
    - Create: required
    - Update: optional; nếu rỗng gửi null để không đổi password
- Modal:
  - forceRender nếu cần (antd khuyến nghị khi Form nằm trong Modal)
  - Reset form on close; setFieldsValue on edit

## Mutations (hook hiện có)
- create: `useCreateUser`
- update: `useUpdateUser`
- delete: `useDeleteUser`
- onSuccess: reset form/modal, message/notification, `router.invalidate()`
- onError: message/notification, giữ modal

## Slots/Wrapper gợi ý
- header: `UserHeader` (button Add User)
- statistics: `UserStatistics` (total/adminCount/staffCount)
- filters: `UserSearchFilter` (search/role/sort/clear)
- table: `UserTable` (tạm reuse, hướng tới GenericTable)
- modals: `UserModals` (tạm reuse, hướng tới GenericForm + confirm)

## API mapping
- apiService: `userApiService` (BaseApiService)
- list loader: route loader cung cấp users + total (đã dùng TanStack Router)
- mutations: invalidate router để refetch loader

