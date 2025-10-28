# Cách hoạt động của loader trong các setup hiện tại (Sử dụng Pattern: Bản thiết kế + Hàm tạo)
1.  **`AdminRouteDefinition` là "Bản thiết kế" (Blueprint):**
    *   Mục đích của tệp `definition` (ví dụ: `users.definition.ts`) là tạo ra một "bản thiết kế" tập trung mọi thứ liên quan đến một trang quản lý: tên thực thể, đường dẫn, schema xác thực, component hiển thị, và quan trọng nhất là **hàm `loader` để tải dữ liệu**.
    *   Việc này giúp code rất có tổ chức. Khi muốn biết trang quản lý người dùng lấy dữ liệu từ đâu, bạn chỉ cần nhìn vào `userAdminDefinition`.

2.  **`generateManagementRoute` là "Hàm tạo" (Generator):**
    *   Hàm này nhận "bản thiết kế" (`AdminRouteDefinition`) ở trên làm đầu vào.
    *   Nó đọc các thông tin từ bản thiết kế và **tạo ra một đối tượng route hoàn chỉnh** mà thư viện TanStack Router có thể hiểu được. Trong quá trình này, nó đã sao chép hàm `loader` từ bản thiết kế của bạn vào thuộc tính `loader` của route thật.


        1.  **Đầu vào:** Hàm `generateManagementRoute` nhận một tham số duy nhất là `definition`. Đây chính là đối tượng "bản thiết kế" mà bạn đã tạo trong tệp `users.definition.ts` (biến `userAdminDefinition`). Đối tượng này chứa tất cả thông tin cần thiết, bao gồm cả hàm `loader` của bạn.

        2.  **Xử lý:** Bên trong, hàm này gọi một hàm khác là `createModuleRouteConfig`. Hàm này chịu trách nhiệm tạo ra một đối tượng route chuẩn mà TanStack Router có thể hiểu được.

        3.  **Quá trình "sao chép":** Đây là phần quan trọng nhất. Khi gọi `createModuleRouteConfig`, chúng ta truyền vào một đối tượng cấu hình lớn. Trong đối tượng này:
            *   `path` của route mới được lấy từ `definition.path`.
            *   `component` của route mới được lấy từ `definition.component`.
            *   Và tương tự, **`loader` của route mới được lấy trực tiếp từ `definition.loader`**.

            Đây không phải là một phép thuật phức tạp. Nó chỉ đơn giản là một phép gán thuộc tính trong JavaScript: `loader: definition.loader`. Thao tác này lấy hàm (thực chất là một tham chiếu đến hàm) mà bạn đã định nghĩa trong `userAdminDefinition` và đặt nó vào đúng vị trí (`loader`) trong đối tượng route mới đang được tạo ra.

        4.  **Đầu ra:** Cuối cùng, hàm trả về  một mảng `adminRoute`, một đối tượng route hoàn chỉnh, sẵn sàng để TanStack Router sử dụng. Đối tượng này giờ đây đã chứa hàm `loader` gốc từ "bản thiết kế" của bạn.

        5. Hệ thống được thiết kế cho các "Module": Cấu trúc routing của bạn được chia thành các "module" (người dùng, sản phẩm, v.v.). Một module không phải lúc nào cũng chỉ có một route duy nhất.
            1. Trường hợp phổ biến: CRUD: Lấy ví dụ về một module quản lý sản phẩm theo kiểu CRUD (Create, Read, Update, Delete) thông thường. Nó sẽ cần ít nhất 4 routes:
            /products (để xem danh sách)
            /products/create (để tạo mới)
            /products/:id (để xem chi tiết)
            /products/:id/edit (để chỉnh sửa) Một hàm tạo route cho module này, ví dụ generateCRUDRoutes, sẽ phải trả về một mảng chứa cả 4 đối tượng route này.

            2. Tính nhất quán của các hàm "Generator":
            Bạn có nhiều hàm "generator" khác nhau: generateCRUDRoutes, generateManagementRoute, v.v.
            Để hàm createModuleRoutes (hàm tiêu thụ kết quả của các generator này) có thể hoạt động một cách thống nhất, nó được thiết kế để luôn nhận vào một mảng các route config.
            Do đó, tất cả các hàm generator, bất kể chúng tạo ra một hay nhiều route, đều phải tuân theo "hợp đồng" này: luôn trả về một mảng.


3.  **`getRouteApi` là "Cầu nối" (Bridge):**
    *   Vấn đề không tìm lấy loader gặp phải không phải là `loader` không tồn tại, mà là component `UserManagementMockPage` không biết cách "nói chuyện" với cái route đã được tạo ra ở bước 2, vì chúng nằm ở các tệp khác nhau.
    *   Hàm `getRouteApi('/admin/users')` chính là "cầu nối". Nó nói với TanStack Router: "Hãy tìm cho tôi cái route có đường dẫn là `/admin/users` và đưa cho tôi API của nó".
    *   Khi đã có API này, component có thể gọi `.useLoaderData()` để lấy dữ liệu mà hàm `loader` (được định nghĩa trong "bản thiết kế" ban đầu) đã tải về.

**Tóm tắt luồng dữ liệu:**

`AdminRouteDefinition` (chứa `loader`) -> `generateManagementRoute` -> Route của TanStack (vẫn chứa `loader`) -> Component dùng `getRouteApi` để tìm Route -> Component gọi `useLoaderData` để lấy dữ liệu từ `loader`.


---

# Phân tích Luồng Tạo Route Module: Management vs CRUD

Tài liệu này phân tích chi tiết hai kiến trúc tạo route module trong dự án, sử dụng pattern "Bản thiết kế" (Definition) và "Hàm tạo" (Generator). Điều này giúp làm rõ cách các route được xây dựng và cách `loader` được truyền tải trong mỗi luồng.

---

## Phần 1: Phân tích Luồng tạo Route Module Management

Luồng này được sử dụng cho các trang quản lý, nơi tất cả các hoạt động (CRUD) được xử lý trên một giao diện duy nhất.

**Chuỗi thực thi:** `userAdminDefinition` -> `generateManagementRoute` -> `createModuleRoutes` -> `createModuleRouteConfig`

### 1. `userAdminDefinition` (Đối tượng)

*   **Vị trí tệp:** `frontend/src/app/routes/modules/management/definition/users.definition.ts`
*   **Công dụng:** Đây là **"Bản thiết kế" (Blueprint)**. Nó định nghĩa tất cả các khía cạnh của một trang quản lý cụ thể một cách tường minh và tập trung.
*   **Đầu vào (Inputs):** Là một đối tượng hằng số với các thuộc tính:
    *   `entityName`: Tên của thực thể (ví dụ: 'Người dùng').
    *   `path`: Đường dẫn URL cho route (ví dụ: '/admin/users').
    *   `component`: Component React sẽ được render.
    *   `searchSchema`: Schema Zod để xác thực tham số tìm kiếm.
    *   `loader`: **Hàm bất đồng bộ** chịu trách nhiệm tải dữ liệu cho trang.
*   **Đầu ra (Output):** Một đối tượng `AdminRouteDefinition` được type-safe, chứa toàn bộ cấu hình, sẵn sàng để "Hàm tạo" sử dụng.

### 2. `generateManagementRoute`

*   **Vị trí tệp:** `frontend/src/app/routes/utils/routeHelpers.ts`
*   **Công dụng:** Đây là **"Hàm tạo" (Generator)**. Nó đọc "Bản thiết kế" và tạo ra một đối tượng route hoàn chỉnh mà TanStack Router có thể hiểu.
*   **Đầu vào (Inputs):**
    *   `definition`: Đối tượng `userAdminDefinition` từ bước 1.
*   **Đầu ra (Output):**
    *   **Một mảng chứa một đối tượng route duy nhất**. Việc trả về mảng đảm bảo tính nhất quán với các generator khác (như `generateCRUDRoutes` có thể trả về nhiều route).

### 3. `createModuleRoutes`

*   **Vị trí tệp:** `frontend/src/app/routes/type/types.ts`
*   **Công dụng:** Đóng gói các route được tạo ra từ generator thành một module hoàn chỉnh, thêm các thông tin chung như tên module và đường dẫn cơ sở.
*   **Đầu vào (Inputs):**
    *   `moduleName`: Tên định danh cho module (ví dụ: 'users').
    *   `basePath`: Đường dẫn gốc cho tất cả các route trong module.
    *   `routes`: Mảng các đối tượng route trả về từ `generateManagementRoute`.
*   **Đầu ra (Output):** Một đối tượng module chứa danh sách các route đã được xử lý, sẵn sàng để đăng ký vào router chính.

### 4. `createModuleRouteConfig`

*   **Vị trí tệp:** `frontend/src/app/routes/type/types.ts`
*   **Công dụng:** Hàm nội bộ cấp thấp, được gọi bởi `generateManagementRoute`. Nó nhận cấu hình chi tiết và tạo ra đối tượng route cuối cùng, đảm bảo các giá trị mặc định (như `pendingComponent`, `errorComponent`) được áp dụng.
*   **Đầu vào (Inputs):** Một đối tượng cấu hình lớn chứa `path`, `component`, `loader`, `meta`, v.v.
*   **Đầu ra (Output):** Một đối tượng `ModuleRouteConfig` hoàn chỉnh.

---

## Phần 2: Phân tích Luồng tạo Route Module CRUD (Giả định)

Luồng này lý tưởng cho các module phức tạp hơn, yêu cầu các trang riêng biệt cho từng hành động: Danh sách, Chi tiết, Tạo, Sửa.

**Chuỗi thực thi (giả định):** `productCrudDefinition` -> `generateCRUDRoutes` -> `createModuleRoutes` -> `createRouteConfig`

### 1. `productCrudDefinition` (Đối tượng)

*   **Vị trí tệp:** `frontend/src/app/routes/modules/management/definition/products.definition.ts` (giả định)
*   **Công dụng:** "Bản thiết kế" cho một module CRUD. Nó định nghĩa các thành phần và logic tải dữ liệu cho từng route riêng lẻ.
*   **Đầu vào (Inputs):** Là một đối tượng hằng số với các thuộc tính:
    *   `entityName`: Tên thực thể (ví dụ: 'Sản phẩm').
    *   `basePath`: Đường dẫn gốc (ví dụ: '/admin/products').
    *   `components`: Một đối tượng chứa các component cho `list`, `detail`, `create`, `edit`.
    *   `loaders`: Một đối tượng chứa các hàm `loader` riêng cho `list` và `detail`.
*   **Đầu ra (Output):** Một đối tượng `CrudModuleDefinition` được type-safe.

### 2. `generateCRUDRoutes`

*   **Vị trí tệp:** `frontend/src/app/routes/utils/routeHelpers.ts`
*   **Công dụng:** "Hàm tạo" cho module CRUD. Nó đọc "Bản thiết kế" và tạo ra một loạt các route cho từng hành động.
*   **Đầu vào (Inputs):**
    *   `definition`: Đối tượng `productCrudDefinition` từ bước 1.
*   **Đầu ra (Output):**
    *   **Một mảng chứa nhiều đối tượng route** (cho list, detail, create, edit). Mỗi route được tạo ra bằng `createRouteConfig` và được gán `component` và `loader` tương ứng.

### 3. `createModuleRoutes`

*   **Công dụng, Đầu vào, Đầu ra:** Tương tự như trong luồng Management. Nó nhận mảng các route từ `generateCRUDRoutes` và đóng gói chúng thành một module.

### 4. `createRouteConfig`

*   **Vị trí tệp:** `frontend/src/app/routes/utils/routeHelpers.ts`
*   **Công dụng:** Một hàm helper cấp thấp hơn, được `generateCRUDRoutes` sử dụng để tạo từng route riêng lẻ. Nó đơn giản hơn `createModuleRouteConfig` một chút nhưng cùng mục đích là chuẩn hóa việc tạo route.
*   **Đầu vào (Inputs):** Cấu hình cho một route đơn lẻ (`path`, `component`, `meta`, ...).
*   **Đầu ra (Output):** Một đối tượng `ModuleRouteConfig`.