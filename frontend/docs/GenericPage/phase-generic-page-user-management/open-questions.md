# Decisions / Assumptions (đã xác nhận)

- Thông báo: dùng `message` / `Modal.success` mặc định antd, bỏ notification modal riêng.
- Bulk actions: cần multi-delete/export. Swagger hiện tại chỉ có delete đơn lẻ (`/api/admin/users/{id}`), chưa có API bulk hoặc export → tạm thời không triển khai, sẽ thiết kế rowSelection sẵn để sẵn sàng khi có API.
- Filter nâng cao: cân nhắc date range… nhưng swagger Users không có tham số thời gian → khả năng thành công thấp, tạm không làm; giữ search + role + sort/pagination.
- Audit: không cần hiển thị.
- Update user: backend cho phép password nullable; khi ô password trống/undefined gửi null (giữ nguyên password).

