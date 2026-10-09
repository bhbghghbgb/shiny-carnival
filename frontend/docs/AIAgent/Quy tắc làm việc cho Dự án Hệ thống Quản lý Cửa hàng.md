---

# Quy tắc làm việc cho Dự án Hệ thống Quản lý Cửa hàng

Đây là bộ quy tắc và hướng dẫn chi tiết cho Agent khi làm việc với dự án "Hệ thống Quản lý Cửa hàng". Các quy tắc này được thiết kế để đảm bảo tính nhất quán, hiệu quả và tuân thủ các tiêu chuẩn của dự án.

## 1. Hướng dẫn Chung

- **Ngôn ngữ:** Luôn sử dụng tiếng Việt trong mọi giao tiếp và tài liệu.

- **Giao tiếp:** Không sử dụng biểu tượng (icons) trong các báo cáo hoặc tài liệu chính thức.

- **Xác nhận thay đổi cấu trúc mã nguồn:** Trước khi thực hiện bất kỳ thay đổi cấu trúc mã nguồn nào, hãy tóm tắt kế hoạch và tìm kiếm sự xác nhận từ người dùng. Chỉ tiến hành khi được phê duyệt.

- **Tuân thủ kế hoạch:** Khi thực hiện kế hoạch, hãy chia nhỏ vấn đề thành các tác vụ nhỏ hơn. Nếu xảy ra lỗi triển khai không thể giải quyết hoặc lỗi logic mã nguồn, hãy dừng ngay lập tức và thông báo cho người dùng; không tự ý thay đổi logic hoặc đi chệch khỏi kế hoạch.

## 2. Thông tin Dự án Cốt lõi (Augment Memory)

Agent phải luôn ghi nhớ và áp dụng các thông tin sau về dự án:

### 2.1. Tổng quan Dự án

- **Tên dự án:** Hệ thống Quản lý Cửa hàng (Store Management System).

- **Mục tiêu:** Ứng dụng web nội bộ để quản lý sản phẩm, tồn kho, đơn hàng, khách hàng, khuyến mãi.

- **Kiến trúc:** Client-server (Frontend React, Backend RESTful API).

- **Cơ sở dữ liệu:** PostgreSQL.

### 2.2. Công nghệ và Cấu trúc Frontend

- **Ngôn ngữ:** TypeScript.

- **Thư viện chính:** React.

- **Cấu trúc thư mục:** Dựa trên Clean Architecture và Feature-Sliced Design (FSD), tổ chức code theo `features` (nghiệp vụ).

- **UI Components:** Ant Design (AntD).

- **Quản lý Trạng thái:** Zustand (toàn cục và cục bộ theo feature).

- **Data Grids:** Ant  Table (headless UI).

- **Quản lý Form:** Ant desgin

- **Gọi API:** Axios (với instance cấu hình sẵn, interceptors).

- **Định tuyến (Routing):** `TanStack-router` với Code-Based Routing.

### 2.3. Cấu trúc Backend và API

- **Xác thực:** JSON Web Token (JWT) qua header `Authorization: Bearer <token>`.

- **Quy ước API:**
  - **Định dạng dữ liệu:** JSON (`application/json`).
  - **Quy ước đặt tên (JSON):** `camelCase` (ví dụ: `productId`).
  - **Cấu trúc phản hồi:** `ApiResponse<T>` (`isError`, `message`, `data`, `timestamp`).
  - **Phân trang:** Hỗ trợ qua `page`, `pageSize`, `search`, `sortBy`, `sortDesc` và trả về `PagedList<T>`.

### 2.4. Vai trò Người dùng

- **Admin:** Quản lý người dùng, sản phẩm, danh mục, nhà cung cấp, khuyến mãi, báo cáo.

- **Staff:** Xử lý đơn hàng, quản lý khách hàng, cập nhật tồn kho, thanh toán.

### 2.5. Các Chức năng Chính

- **Quản lý Sản phẩm:** Thêm, sửa, xóa, tìm kiếm, lọc sản phẩm.

- **Quản lý Đơn hàng:** Tạo, cập nhật trạng thái, thêm/sửa/xóa sản phẩm trong đơn hàng, áp dụng khuyến mãi.

- **Quản lý Khách hàng:** Thêm, quản lý thông tin.

- **Quản lý Tồn kho:** Tự động cập nhật, cảnh báo khi tồn kho thấp.

- **Quản lý Khuyến mãi:** Tạo, quản lý mã giảm giá, thời gian, giới hạn sử dụng.

- **Thanh toán:** Chỉ hỗ trợ tiền mặt, trạng thái đơn hàng `paid` tương đương đã thanh toán.

- **Báo cáo:** Admin xem báo cáo doanh thu, sản phẩm bán chạy.

- **Xuất PDF:** Xuất hóa đơn PDF từ thông tin đơn hàng đã thanh toán.

### 2.6. Mô hình Dữ liệu (ERD)

- **Thực thể:** `Users`, `Customers`, `Categories`, `Suppliers`, `Products`, `Inventory`, `Promotions`, `Orders`, `Order_Items`, `Payments`.

- **Mối quan hệ:** Đã được định nghĩa rõ trong tài liệu ERD (ví dụ: `Customers` 1-N `Orders`, `Products` 1-1 `Inventory`).

## 3. Hướng dẫn Thực thi Tác vụ

### 3.1. Phân tích Ban đầu (Sequence Thinking)

- Phân tích yêu cầu thành các thành phần cốt lõi.

- Xác định các khái niệm và mối quan hệ chính.

- Lập chiến lược tìm kiếm và xác minh.

- Xác định các công cụ hiệu quả nhất.

### 3.2. Truy xuất Thông tin (Search)

- **Brave Search:** Bắt đầu với tìm kiếm ngữ cảnh rộng, sau đó sử dụng tìm kiếm mục tiêu cho các khía cạnh cụ thể. Ghi lại và phân tích kết quả.

- **Perplexity Search:** Sử dụng để phân tích/tìm kiếm chuyên sâu các khái niệm/thông tin từ Brave Search, cung cấp ngữ cảnh cần thiết.

### 3.3. Xác minh Chuyên sâu (Browser/Puppeteer)

- Điều hướng đến các trang web chính từ kết quả tìm kiếm.

- Chụp ảnh màn hình các nội dung liên quan.

- Trích xuất dữ liệu cụ thể.

- Tương tác với trang web (click, điền form) nếu cần.

- Luôn xác minh rằng đã truy cập đúng trang và thu thập được thông tin cần thiết.

### 3.4. Tổng hợp & Trình bày

- Kết hợp các phát hiện từ tất cả các công cụ.

- Trình bày thông tin theo định dạng có cấu trúc.

- Tạo các artifact cho các đoạn mã, hình ảnh trực quan hoặc tài liệu dài.

- Nêu bật các hiểu biết và mối quan hệ chính.

## 4. Yêu cầu Tài liệu Nguồn

- Tất cả kết quả tìm kiếm phải bao gồm URL đầy đủ và tiêu đề.

- Ảnh chụp màn hình phải bao gồm URL nguồn và dấu thời gian.

- Các nguồn dữ liệu phải được trích dẫn rõ ràng với ngày truy cập.

- Các mục trong Memory phải duy trì liên kết nguồn.

- Tất cả các phát hiện phải có thể truy nguyên về nguồn gốc ban đầu.

- Trích dẫn nội dung bên ngoài phải bao gồm liên kết nguồn trực tiếp.

## 5. Định dạng Báo cáo Công việc

Sau khi hoàn thành một tác vụ lớn, hãy tạo một báo cáo bằng tiếng Việt ở định dạng Markdown (.md) với các phần sau:

### A. Tóm tắt Nhiệm vụ

### B. Chi tiết Triển khai Mã nguồn

- Trích dẫn các đoạn mã quan trọng (Tên tệp, Dòng).

- Giải thích logic, mục đích và các quyết định thiết kế cho từng đoạn mã.

- Cung cấp các ví dụ mã cụ thể và chi tiết. Tham chiếu đến các tệp thực tế trong codebase.

### C. Kiểm thử

- Mô tả các loại kiểm thử đã thực hiện (unit test, integration test, manual test).

- Chỉ định các trường hợp kiểm thử chính và kết quả.

- (Nếu có thể) Trích dẫn mã kiểm thử liên quan.

- Khi viết kiểm thử, hãy xác định rõ lý do thất bại của kiểm thử: nếu do kiểm thử sai, hãy sửa đổi kiểm thử; nếu do lỗi logic mã nguồn, hãy dừng triển khai và thông báo cho người dùng.

### D. Thách thức và Giải pháp

- Liệt kê các vấn đề và khó khăn gặp phải.

- Mô tả phân tích và phương pháp giải quyết.

### E. Cải tiến và Tối ưu hóa

- Nêu bật các cải tiến để tối ưu hóa mã nguồn (hiệu suất, khả năng đọc, bảo mật).

### F. Công cụ và Công nghệ đã sử dụng

- **Phát triển:** Ngôn ngữ, Frameworks, IDEs, Thư viện chính.

- **Kiểm thử:** Frameworks, Công cụ.

- **Triển khai:** Docker, K8s, nền tảng Serverless (nếu có).

- **Giám sát & Ghi nhật ký:** Công cụ.

- **Phân tích mã:** Công cụ.

- **Khác:** Các công cụ hoặc công nghệ quan trọng khác đã sử dụng.

## 6. Kế hoạch Giải quyết Vấn đề của Người dùng

Khi được yêu cầu tạo kế hoạch, hãy sử dụng cấu trúc sau:

1. **Bước 1: Xác định Vấn đề:** Chia nhỏ vấn đề của người dùng và nhóm chúng thành các giai đoạn.

1. **Bước 2: Phân tích và Triển khai:** Phân tích chi tiết vấn đề, triển khai các bước giải quyết cho từng giai đoạn (viết mã chi tiết).

1. **Bước 3: Kiểm thử:** Hỏi người dùng về các loại kiểm thử mong muốn (unit test, e2e test, integration test) và tiến hành kiểm thử.

