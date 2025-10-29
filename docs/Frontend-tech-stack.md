### 1. Thư viện Giao diện người dùng (UI Component Libraries)

Đây là nền tảng của giao diện ứng dụng, cung cấp các thành phần dựng sẵn giúp đẩy nhanh tốc độ phát triển và đảm bảo tính nhất quán. Các thư viện này thường được thiết kế chuyên cho các ứng dụng doanh nghiệp.

*   **Ant Design (AntD):** Một lựa chọn hàng đầu cho các ứng dụng cấp doanh nghiệp. AntD cung cấp một bộ sưu tập lớn các component chất lượng cao, từ bảng biểu, form, đến các thành phần trực quan hóa dữ liệu, cùng với tài liệu chi tiết và hỗ trợ quốc tế hóa mạnh mẽ.

### 2. Quản lý Trạng thái (State Management)

Hệ thống Store Management có trạng thái ứng dụng phức tạp, cần được quản lý một cách khoa học để tránh lỗi và dễ dàng bảo trì.

*   **Zustand:** Một lựa chọn hiện đại, nhẹ nhàng. Sử dụng hooks để quản lý trạng thái, phù hợp cho các dự án muốn giảm sự phức tạp ban đầu.

### 3. Hiển thị Dữ liệu dạng Bảng/Lưới (Data Grids)

Các ứng dụng quản lý cửa hàng luôn phải làm việc với một lượng lớn dữ liệu dạng bảng. Một thư viện Data Grid mạnh mẽ là không thể thiếu.

*   **Ant Table:** Là một component có sẵn trong Ant Design, được sử dụng để hiển thị dữ liệu dạng bảng với nhiều tính năng như phân trang, sắp xếp, lọc.

### 4. Quản lý Form

Việc nhập liệu là một phần cốt lõi, đòi hỏi các form phức tạp với logic xác thực (validation) chặt chẽ.

*   **Ant Design Form:** Sử dụng component Form có sẵn của Ant Design với các control tích hợp, cung cấp khả năng quản lý form mạnh mẽ và validation built-in.

### 5. Định tuyến (Routing)

*   **TanStack Router với Code-Based Routing:** Sử dụng hệ thống định tuyến mạnh mẽ của TanStack Router với cơ chế code-based routing, cho phép định nghĩa các route trong ứng dụng React bằng cách cấu hình sử dụng TypeScript.

### 6. Xác thực và Phân quyền (Authentication & Authorization)

Bảo mật là yếu tố quan trọng của một hệ thống quản lý cửa hàng.

*   **JWT (JSON Web Tokens):** Sử dụng JWT để xác thực người dùng, token được gửi qua header `Authorization: Bearer <token>`.

### 7. Framework và Công nghệ

*   **React 19:** Phiên bản mới nhất của React với React Compiler plugin được kích hoạt.
*   **TypeScript:** Ngôn ngữ lập trình chính với strict mode được bật.
*   **Vite:** Công cụ build và phát triển nhanh chóng.
*   **Yarn 4.10.3:** Package manager được sử dụng.

### 8. Các Thư viện Hữu ích Khác

*   **Axios:** Thư viện phổ biến để thực hiện các yêu cầu HTTP, có cấu hình interceptors cho token và xử lý lỗi.
*   **Zod:** Thư viện validation mạnh mẽ được sử dụng cho form và API validation.
*   **Tailwind CSS:** Framework CSS utility-first với Typography plugin.
*   **TanStack Table:** Thư viện headless UI cho việc xây dựng bảng dữ liệu phức tạp.
