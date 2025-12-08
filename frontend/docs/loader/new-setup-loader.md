# Kiến trúc Loader và Tạo Route trong Cấu trúc Mới

Tài liệu này phân tích kiến trúc tạo route module đã được tái cấu trúc, sử dụng pattern "Bản thiết kế" (Definition), "Hàm tạo" (Generator), và "Trình xây dựng cây" (Tree Builder) để tạo ra một hệ thống định tuyến phân cấp, type-safe và dễ bảo trì.

---

## 1. Tổng quan về Luồng Kiến trúc

Luồng xử lý mới được áp dụng nhất quán cho tất cả các loại module (CRUD, Management, Standalone) và có thể được tóm tắt qua 3 bước chính:

**Chuỗi thực thi:** `Definition` (Bản thiết kế) -> `Generator` (Hàm tạo) -> `Tree Builder` (Trình xây dựng)

1.  **Definition (`*.definition.ts`):** Là "bản thiết kế" (Blueprint), nơi tập trung toàn bộ cấu hình cho một chức năng, bao gồm `path`, `component`, `searchSchema`, và quan trọng nhất là hàm `loader`.
2.  **Generator (`routeHelpers.ts`):** Là "nhà máy" (Factory), nhận "bản thiết kế" và tạo ra một cấu trúc config route phân cấp (`HierarchicalModuleRouteConfig`).
3.  **Tree Builder (`routeTree.ts`):** Là "trình xây dựng" (Builder), nhận các cấu trúc config từ nhiều module khác nhau và sử dụng hàm đệ quy `buildRoutesFromConfig` để tạo ra cây route cuối cùng cho ứng dụng.

---

## 2. Phân tích Chi tiết các Thành phần

### Bước 1: "Bản thiết kế" - `*.definition.ts`

*   **Vị trí:** `frontend/src/app/routes/modules/**/definition/`
*   **Công dụng:** Tạo ra một bản thiết kế tập trung, tường minh cho một module chức năng. Ví dụ, `users.definition.ts` định nghĩa mọi thứ cần thiết cho route quản lý người dùng.
*   **Đặc điểm chính:**
    *   **Tập trung Logic:** Gom `component`, `loader`, và `searchSchema` vào một nơi.
    *   **Đường dẫn Tương đối:** Thuộc tính `path` (hoặc `basePath` cho CRUD) giờ đây là đường dẫn **tương đối** so với route cha của nó (ví dụ: `users` thay vì `/admin/users`). Điều này giúp các module hoàn toàn độc lập và không cần biết về layout cha.

### Bước 2: "Hàm tạo" - `routeHelpers.ts`

*   **Vị trí:** `frontend/src/app/routes/utils/routeHelpers.ts`
*   **Công dụng:** Chứa các hàm "generator" (`generateManagementRoute`, `generateCRUDRoutes`) để chuyển đổi "bản thiết kế" thành một cấu trúc config phân cấp.
*   **Đặc điểm chính:**
    *   **Tạo Cấu trúc Phân cấp:** Thay vì trả về một mảng route phẳng, các hàm generator giờ đây xây dựng một cây object. Ví dụ, `generateCRUDRoutes` trả về một config cho trang `list`, và các config cho `detail`, `create` được lồng vào thuộc tính `children` của nó.
    *   **Sử dụng `createHierarchicalRouteConfig`:** Một hàm helper nội bộ chịu trách nhiệm tạo từng đối tượng config, áp dụng các giá trị mặc định (`pendingComponent`, `errorComponent`) và đảm bảo type-safety.

### Bước 3: "Trình xây dựng" - `routeTree.ts`

*   **Vị trí:** `frontend/src/app/routes/routeTree.ts`
*   **Công dụng:** Là trung tâm của hệ thống định tuyến, nơi tất cả các mảnh ghép được kết hợp lại.
*   **Luồng hoạt động:**
    1.  **Gom nhóm Modules:** Các module route được import và phân nhóm (ví dụ: `standaloneModuleRoutes` và `adminModuleRoutes`).
    2.  **Sử dụng `buildRoutesFromConfig`:** Đây là một hàm đệ quy, trái tim của `routeTree`. Nó nhận vào một mảng các `HierarchicalModuleRouteConfig` và một `parentRoute`.
    3.  **Tạo Route Đệ quy:** Hàm này duyệt qua từng config. Với mỗi config, nó gọi `createRoute` của TanStack Router để tạo route thật và gắn nó vào `parentRoute`. Nếu một config có thuộc tính `children`, hàm sẽ tự gọi lại chính nó để xây dựng các route con, tạo ra một cây route hoàn chỉnh.
    4.  **Xử lý `loader` Type-Safe:** Để giải quyết sự không tương thích giữa `LoaderContext` tùy chỉnh và `LoaderFnContext` của TanStack Router, `buildRoutesFromConfig` sử dụng `loaderDeps` để khai báo các tham số tìm kiếm như một phụ thuộc. TanStack Router sau đó sẽ truyền các tham số đã được xác thực này vào `loader` thông qua thuộc tính `deps`, đảm bảo type-safety.

## 3. Cách `loader` được Truyền tải và Sử dụng

Luồng dữ liệu của `loader` trong kiến trúc mới rất rõ ràng:

1.  **Định nghĩa:** `loader` được viết trong file `*.definition.ts`.
2.  **Đóng gói:** Hàm generator trong `routeHelpers.ts` đọc `loader` từ bản thiết kế và đặt nó vào cấu trúc config phân cấp.
3.  **Tạo Route thật:** Hàm `buildRoutesFromConfig` trong `routeTree.ts` lấy `loader` từ config và truyền nó vào hàm `createRoute` (cùng với `loaderDeps`).
4.  **Sử dụng trong Component:** Component tương ứng (ví dụ: `UserManagementPage`) giờ đây có thể truy cập dữ liệu một cách an toàn và trực tiếp bằng cách sử dụng hook `useLoaderData` được cung cấp bởi chính route của nó (được tạo ra từ file-based routing hoặc định nghĩa strong-typed), mà **không cần dùng `getRouteApi` nữa**.

**Tóm tắt luồng dữ liệu mới:**

`Definition` (chứa `loader`) -> `Generator` (tạo config phân cấp) -> `buildRoutesFromConfig` (tạo route thật với `loader` và `loaderDeps`) -> Component dùng `useLoaderData` để truy cập dữ liệu.