# Architecture Notes — Generic Page cho User Management

## Bối cảnh
- Code hiện tại: `UserManagementPage` orchestration + hook `useUserManagementPage` quản lý modal, search/sort/filter qua TanStack Router search params, CRUD mutations từ `useUsers`.
- Hạn chế: xử lý modal và form còn rời rạc, chưa tận dụng config-driven/slots, nhiều logic có thể khái quát.

## Nguyên tắc áp dụng
- Config-driven: định nghĩa `GenericPageConfig` cho entity user (entity meta, apiService, table config, form create/update).
- Reuse hooks: tận dụng `useApiCreate/Update/Delete`, `usePaginationWithRouter`, `BaseApiService`.
- Slots optional: giữ `UserHeader`, `UserStatistics`, `UserSearchFilter` làm slots/sections tùy chỉnh để không mất UI hiện có.
- URL-first: search/sort/filter đồng bộ qua TanStack Router search params; table và controls đọc/ghi trực tiếp vào URL.
- Modal/Form: dùng Antd Modal + Form; lưu ý `forceRender` khi form nằm trong modal (theo antd docs).

## Mapping vào UserManagementPage
- Entity meta: name `users`, display `User/Users`.
- Table: columns username/fullName/role/createdAt; row actions edit/delete; server sort `sortField/sortOrder`; pagination page/pageSize từ search params.
- Filters: search text, role (0 admin, 1 staff), sort default `createdAt desc`.
- Form create/update: trường username, fullName, role, password (optional khi update → gửi null nếu rỗng).
- Feedback: dùng message/notification modal hiện có; delete với popconfirm (hoặc modal xác nhận hiện tại).

## Định hướng refactor nhẹ cho pilot
- Giữ giao diện hiện tại, thêm tầng config + generic components dần, tránh breaking change.
- Bao bọc logic modal/form vào generic form handler nhưng giữ hook `useUserManagementPage` làm adapter tạm thời.
- Chuẩn bị tách `userPageConfig.ts` để các page khác reuse cấu trúc.

