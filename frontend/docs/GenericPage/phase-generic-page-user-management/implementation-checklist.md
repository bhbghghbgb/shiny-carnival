# Implementation Checklist — Generic Page (User Management)

## Chuẩn bị
- [ ] Xác thực search params schema (page, pageSize, search, role, sortField, sortOrder) trên route loader.
- [ ] Đảm bảo `userApiService` sẵn sàng cho CRUD + getPaginated.
- [ ] Kiểm tra `usePaginationWithRouter` hoặc navigate search đang dùng ổn.

## Table & Filter
- [ ] Định nghĩa columns (username, fullName, role, createdAt) với sorter keys map sang backend.
- [ ] Row actions: edit, delete (popconfirm hoặc modal xác nhận).
- [ ] Pagination + sort đọc/ghi URL: navigate({ search: (prev) => ({ ...prev, ... }) }).
- [ ] Clear filter trả về default: page=1, pageSize=10, sortField=createdAt, sortOrder=descend, search undefined, role undefined.

## Form / Modal
- [ ] Modal chứa Form, thêm `forceRender` nếu cần để tránh cảnh báo antd.
- [ ] Create: yêu cầu username, fullName, role, password.
- [ ] Update: password optional → nếu input rỗng/undefined gửi null.
- [ ] Form reset khi đóng; setFieldsValue khi edit.

## Mutations
- [ ] useApiCreate/Update/Delete với onSuccess: reset form/modal, message/notification, router.invalidate().
- [ ] onError: hiển thị message/notification, không đóng modal.
- [ ] Delete: mutate với id, success → close delete modal + invalidate.

## Slots/Wrapper UI
- [ ] Header: dùng `UserHeader` (button mở modal create).
- [ ] Statistics: `UserStatistics` dùng data hiện tại.
- [ ] Filters: `UserSearchFilter` điều khiển search/role/sort.

## Data mapping
- [ ] Loader data → users, total.
- [ ] Derived stats: adminCount (role=0), staffCount (role=1).

## UX & trạng thái
- [ ] Loading/error: tận dụng state từ query/mutation (hiện đang tối giản).
- [ ] Thông báo: success/error modal hoặc message; close notification modal handler.

## Testing tối thiểu
- [ ] Create user mới thành công, form reset, list refresh.
- [ ] Update user: đổi role/name, password bỏ trống không đổi, có giá trị thì đổi.
- [ ] Delete user: confirm → list refresh.
- [ ] Search/filter/sort/pagination đồng bộ URL; clearFilters đưa về default.

