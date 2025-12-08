# Bộ nhớ Dự án: Hệ thống Quản lý Cửa hàng

## 1. Tổng quan Dự án

- **Tên dự án:** Hệ thống Quản lý Cửa hàng (Store Management System).

- **Mục tiêu:** Xây dựng một ứng dụng web nội bộ để quản lý các hoạt động kinh doanh cốt lõi của một cửa hàng bán lẻ, bao gồm sản phẩm, tồn kho, đơn hàng, khách hàng và khuyến mãi.

- **Kiến trúc:** Hệ thống theo mô hình client-server, bao gồm một frontend React và một backend cung cấp RESTful API.

- **Cơ sở dữ liệu:** Sử dụng hệ quản trị cơ sở dữ liệu quan hệ (PostgreSQL).

## 2. Công nghệ và Cấu trúc Frontend

- **Ngôn ngữ:** TypeScript.

- **Thư viện chính:** React.

- **Cấu trúc thư mục:** Dựa trên nguyên tắc Clean Architecture và Feature-Sliced Design (FSD). Code được tổ chức theo các `features` (nghiệp vụ) thay vì theo loại kỹ thuật.

- **UI Components:** Sử dụng thư viện Ant Design (AntD).

- **Quản lý Trạng thái (State Management):** Sử dụng Zustand cho quản lý trạng thái toàn cục và cục bộ theo feature.

- **Hiển thị Bảng/Lưới (Data Grids):** Sử dụng TanStack Table (headless UI) để hiển thị dữ liệu dạng bảng.

- **Quản lý Form:** Sử dụng React Hook Form.

- **Gọi API:** Sử dụng Axios, với một instance được cấu hình sẵn (interceptors để xử lý token và lỗi).

- **Định tuyến (Routing):** Sử dụng File-Based Routing của TanStack.

## 3. Cấu trúc Backend và API

- **Xác thực:** Sử dụng JSON Web Token (JWT). Token được gửi qua header `Authorization: Bearer <token>`.

- **Quy ước API:**
  - **Định dạng dữ liệu:** JSON (`application/json`).
  - **Quy ước đặt tên (JSON):** `camelCase` (ví dụ: `productId`).
  - **Cấu trúc phản hồi:** Tất cả các response đều có cấu trúc chung `ApiResponse<T>` bao gồm các trường `isError`, `message`, `data`, và `timestamp`.
  - **Phân trang:** Các API lấy danh sách hỗ trợ phân trang với các tham số `page`, `pageSize`, `search`, `sortBy`, `sortDesc` và trả về cấu trúc `PagedList<T>`.

## 4. Các Chức năng và Nghiệp vụ chính (Features)

- **Người dùng (Users):** Có 2 vai trò: `Admin` và `Staff`.
  - `Admin`: Quản lý người dùng, sản phẩm, danh mục, nhà cung cấp, khuyến mãi, xem báo cáo.
  - `Staff`: Xử lý đơn hàng, quản lý khách hàng, cập nhật tồn kho, thực hiện thanh toán.

- **Sản phẩm (Products):** Quản lý thông tin sản phẩm, bao gồm tên, giá, mã vạch, danh mục, nhà cung cấp.

- **Đơn hàng (Orders):** Nhân viên tạo đơn hàng, thêm sản phẩm (`Order_Items`), áp dụng khuyến mãi, và cập nhật trạng thái (`pending`, `paid`, `canceled`).

- **Khách hàng (Customers):** Quản lý thông tin khách hàng.

- **Tồn kho (Inventory):** Hệ thống tự động cập nhật tồn kho khi đơn hàng được tạo hoặc hủy. Có cảnh báo khi tồn kho dưới mức an toàn.

- **Khuyến mãi (Promotions):** Admin tạo và quản lý các chương trình khuyến mãi (mã, loại giảm giá, thời gian, giới hạn sử dụng).

- **Thanh toán (Payments):** Hệ thống chỉ hỗ trợ thanh toán tiền mặt. Trạng thái đơn hàng `paid` tương đương với đã thanh toán.

- **Báo cáo (Reports):** Admin có thể xem báo cáo doanh thu và sản phẩm bán chạy.

- **Xuất PDF:** Sau khi đơn hàng được thanh toán thành công, hệ thống có thể xuất hóa đơn (dựa trên thông tin đơn hàng) ra file PDF.

## 5. Mô hình Dữ liệu (ERD)

- **Các thực thể chính:** `Users`, `Customers`, `Categories`, `Suppliers`, `Products`, `Inventory`, `Promotions`, `Orders`, `Order_Items`, `Payments`.

- **Mối quan hệ quan trọng:**
  - `Customers` 1-N `Orders`
  - `Users` 1-N `Orders` (Nhân viên xử lý đơn hàng)
  - `Orders` 1-N `Order_Items`
  - `Products` 1-N `Order_Items`
  - `Categories` 1-N `Products`
  - `Suppliers` 1-N `Products`
  - `Products` 1-1 `Inventory`

