# Cấu trúc file chuẩn cho dự án React RestAPI

## Giới thiệu

Tài liệu này mô tả cấu trúc file được đề xuất cho một dự án React RestAPI sử dụng các công nghệ như Tailwind CSS, Axios, Ant Design, TanStack Table và Zustand. Cấu trúc này được thiết kế dựa trên các nguyên tắc của Clean Architecture và Feature-Sliced Design (FSD) nhằm đảm bảo tính **clean**, **khả năng mở rộng (scalability)**, **tái sử dụng (reusability)** và **dễ bảo trì (maintainability)**.

## Các nguyên tắc thiết kế chính

1.  **Separation of Concerns (Tách biệt các mối quan tâm):** Mỗi phần của ứng dụng có một trách nhiệm rõ ràng và độc lập, giảm thiểu sự phụ thuộc lẫn nhau.
2.  **Domain-Driven Design (Thiết kế hướng theo nghiệp vụ):** Tổ chức code theo các tính năng hoặc nghiệp vụ (domain) thay vì theo loại kỹ thuật (components, services).
3.  **Clean Architecture:** Đảm bảo lớp nghiệp vụ (business logic) độc lập với các chi tiết triển khai (UI, database, API).
4.  **Scalability & Reusability:** Dễ dàng thêm tính năng mới mà không ảnh hưởng lớn đến các phần hiện có, và cho phép tái sử dụng các module trên nhiều dự án.
5.  **Testability:** Cấu trúc rõ ràng giúp việc viết và chạy unit/integration tests hiệu quả hơn.

## Cấu trúc thư mục tổng quan

```
src/
├── app/                  // Cấu hình ứng dụng toàn cục, routing, store
├── assets/               // Tài nguyên tĩnh (ảnh, font, icon)
├── components/           // Các UI component dùng chung (presentational components)
├── config/               // Cấu hình môi trường, hằng số
├── constants/            // Các hằng số được sử dụng trong ứng dụng
├── features/             // Các module tính năng/nghiệp vụ chính (feature-sliced)
├── hooks/                // Custom React Hooks dùng chung
├── layouts/              // Bố cục trang (layout components)
├── lib/                  // Thư viện tiện ích, helpers, cấu hình Axios
├── pages/                // Các trang ứng dụng (container components/routes)
├── services/             // Các service tương tác với API (data layer)
├── types/                // Định nghĩa kiểu dữ liệu TypeScript dùng chung
├── utils/                // Các hàm tiện ích chung
└── App.tsx               // Component gốc của ứng dụng
```

## Giải thích chi tiết từng thư mục

### `src/app/`

Chứa các file cấu hình và khởi tạo cấp ứng dụng. Đây là nơi tập trung các cài đặt toàn cục.

*   `App.tsx`: Component React gốc, nơi các `Layout` và `Router` được render.
*   `main.tsx`: Điểm khởi chạy của ứng dụng (entry point), nơi React DOM được render.
*   `router.tsx`: Cấu hình định tuyến (routing) của ứng dụng, thường sử dụng `react-router-dom`.
*   `store.ts`: Cấu hình Zustand store toàn cục, nơi định nghĩa các slice của store và cách chúng tương tác.

### `src/assets/`

Chứa tất cả các tài nguyên tĩnh không phải là code.

*   `images/`: Các tệp hình ảnh (JPEG, PNG, SVG).
*   `fonts/`: Các tệp font chữ tùy chỉnh.
*   `icons/`: Các tệp icon (SVG, Font Awesome, v.v.).

### `src/components/`

Chứa các UI component nhỏ, dùng chung, không có logic nghiệp vụ phức tạp (presentational/dumb components). Chúng nhận props và render UI.

*   `Button/`: `Button.tsx`, `Button.module.css` (hoặc sử dụng Tailwind).
*   `Input/`: `Input.tsx`.
*   `Modal/`: `Modal.tsx`.
*   `Table/`: Các component liên quan đến TanStack Table nếu có các phần dùng chung.

### `src/config/`

Chứa các file cấu hình liên quan đến môi trường hoặc các hằng số cấu hình lớn.

*   `api.ts`: Cấu hình URL cơ sở của API, timeout, v.v.
*   `env.ts`: Xử lý các biến môi trường.

### `src/constants/`

Chứa các hằng số được sử dụng xuyên suốt ứng dụng, giúp tránh 'magic strings' và 'magic numbers'.

*   `app.ts`: Tên ứng dụng, phiên bản, v.v.
*   `routes.ts`: Các đường dẫn (path) của route.
*   `messages.ts`: Các thông báo lỗi, thông báo thành công.

### `src/features/`

Đây là phần quan trọng nhất, tổ chức code theo tính năng/nghiệp vụ. Mỗi thư mục con trong `features` đại diện cho một tính năng độc lập (ví dụ: `auth`, `products`, `users`, `orders`). Cấu trúc bên trong mỗi feature có thể tuân theo mô hình FSD hoặc Clean Architecture.

Ví dụ cấu trúc bên trong một `feature` (`products`):

```
src/features/products/
├── api/                  // Các hàm gọi API liên quan đến sản phẩm (sử dụng Axios)
│   ├── productApi.ts
│   └── index.ts
├── components/           // Các UI component cụ thể của tính năng sản phẩm
│   ├── ProductCard.tsx
│   ├── ProductFilter.tsx
│   └── index.ts
├── hooks/                // Custom hooks cụ thể cho tính năng sản phẩm
│   ├── useProductDetails.ts
│   └── index.ts
├── pages/                // Các trang thuộc tính năng sản phẩm
│   ├── ProductListPage.tsx
│   ├── ProductDetailsPage.tsx
│   └── index.ts
├── store/                // Zustand store slice cho tính năng sản phẩm
│   ├── productStore.ts
│   └── index.ts
├── types/                // Định nghĩa kiểu dữ liệu TypeScript cho sản phẩm
│   ├── product.ts
│   └── index.ts
├── utils/                // Các hàm tiện ích cụ thể cho tính năng sản phẩm
│   ├── productUtils.ts
│   └── index.ts
└── index.ts              // Export các thành phần chính của feature
```

**Giải thích chi tiết các thư mục con trong `features/[feature-name]/`:**

*   `api/`: Chứa các hàm để tương tác với API backend cho tính năng này. Sử dụng Axios instance đã được cấu hình ở `lib/axios.ts`.
*   `components/`: Các component UI chỉ dùng trong tính năng này. Nếu component có thể tái sử dụng rộng rãi, hãy cân nhắc chuyển nó lên `src/components/`.
*   `hooks/`: Các custom hook cụ thể cho tính năng này, giúp đóng gói logic tái sử dụng trong phạm vi feature.
*   `pages/`: Các trang chính của ứng dụng thuộc tính năng này. Đây thường là các container components quản lý state và gọi các service.
*   `store/`: Chứa các định nghĩa slice của Zustand store dành riêng cho tính năng này. Giúp quản lý state cục bộ của feature một cách rõ ràng.
*   `types/`: Định nghĩa các interface hoặc type TypeScript cho các đối tượng dữ liệu, props, state liên quan đến tính năng.
*   `utils/`: Các hàm tiện ích nhỏ, thuần túy (pure functions) chỉ dùng cho tính năng này.
*   `index.ts`: File export tổng hợp các thành phần chính của feature để dễ dàng import từ bên ngoài.

### `src/hooks/`

Chứa các custom React Hooks dùng chung cho toàn bộ ứng dụng, không gắn liền với một tính năng cụ thể nào.

*   `useAuth.ts`: Hook quản lý trạng thái xác thực.
*   `useDebounce.ts`: Hook debounce giá trị.
*   `useLocalStorage.ts`: Hook tương tác với Local Storage.

### `src/layouts/`

Chứa các component định nghĩa bố cục trang tổng thể của ứng dụng (ví dụ: `DefaultLayout`, `AuthLayout`). Chúng thường bao gồm `Header`, `Sidebar`, `Footer` và một vùng `children` để render nội dung chính.

*   `DefaultLayout.tsx`
*   `AuthLayout.tsx`

### `src/lib/`

Chứa các cấu hình và instance của các thư viện bên thứ ba, hoặc các tiện ích cấp thấp.

*   `axios.ts`: Cấu hình instance Axios với interceptors (xử lý lỗi, thêm token).
*   `ant-design.ts`: Cấu hình theme hoặc các cài đặt chung cho Ant Design.
*   `tanstack-table.ts`: Các tiện ích hoặc cấu hình chung cho TanStack Table.

### `src/pages/`

Chứa các trang chính của ứng dụng. Trong cấu trúc này, `pages` thường đóng vai trò là container cho các `features` hoặc các `components` lớn. Nếu một trang thuộc về một tính năng cụ thể, nó nên nằm trong `features/[feature-name]/pages/`.

*   `HomePage.tsx`
*   `NotFoundPage.tsx`

### `src/services/`

Chứa các module chịu trách nhiệm tương tác với API backend. Đây là lớp `data layer` của ứng dụng. Các hàm trong đây nên là pure functions hoặc các hàm chỉ tập trung vào việc gọi API và xử lý dữ liệu thô từ API.

*   `authService.ts`: Các hàm liên quan đến xác thực (login, register).
*   `userService.ts`: Các hàm liên quan đến người dùng.
*   `productService.ts`: Các hàm liên quan đến sản phẩm. (Có thể được di chuyển vào `features/products/api/` nếu muốn tách biệt hơn theo feature).

### `src/types/`

Chứa tất cả các định nghĩa kiểu dữ liệu TypeScript dùng chung cho toàn bộ ứng dụng.

*   `common.ts`: Các kiểu dữ liệu chung (ví dụ: `ApiResponse`, `PaginationMeta`).
*   `user.ts`: Kiểu dữ liệu cho đối tượng người dùng.
*   `product.ts`: Kiểu dữ liệu cho đối tượng sản phẩm. (Có thể được di chuyển vào `features/products/types/` nếu muốn tách biệt hơn theo feature).

### `src/utils/`

Chứa các hàm tiện ích nhỏ, độc lập, không phụ thuộc vào React hoặc logic nghiệp vụ cụ thể. Chúng thường là các hàm thuần túy (pure functions).

*   `formatters.ts`: Các hàm định dạng dữ liệu (ngày, số, tiền tệ).
*   `validators.ts`: Các hàm kiểm tra tính hợp lệ của dữ liệu.
*   `helpers.ts`: Các hàm tiện ích chung khác.

## Ví dụ về luồng dữ liệu (Data Flow)

1.  **UI (Page/Component):** Người dùng tương tác với một component UI (ví dụ: `ProductListPage.tsx`).
2.  **Hook/Store:** Component này gọi một custom hook (ví dụ: `useProductStore` từ Zustand)
3.  **Service/API:** Hook hoặc action trong store gọi một hàm từ `features/products/api/productApi.ts` để tương tác với backend thông qua instance Axios đã được cấu hình.
4.  **Backend:** Backend xử lý yêu cầu và trả về dữ liệu.
5.  **Service/API:** Hàm API nhận dữ liệu từ backend, có thể thực hiện một số biến đổi dữ liệu sơ bộ.
6.  **Store:** Dữ liệu được cập nhật vào Zustand store.
7.  **UI:** Component UI tự động re-render với dữ liệu mới từ store.

## Kết luận

Cấu trúc file này cung cấp một nền tảng vững chắc cho việc phát triển các ứng dụng React RestAPI có khả năng mở rộng và dễ bảo trì. Bằng cách tuân thủ các nguyên tắc tách biệt mối quan tâm và tổ chức code theo tính năng, dự án của bạn sẽ trở nên dễ quản lý hơn, đặc biệt khi quy mô ứng dụng và số lượng thành viên trong nhóm phát triển tăng lên. Việc sử dụng TypeScript cùng với cấu trúc này sẽ nâng cao hơn nữa chất lượng code và khả năng phát hiện lỗi sớm.

## Tài liệu tham khảo

*   [Clean Architecture in React](https://alexkondov.com/full-stack-tao-clean-architecture-react/)
*   [Folder Structuring Techniques for Advanced React Projects](https://dev.to/fpaghar/folder-structuring-techniques-for-beginner-to-advanced-react-projects-30d7)
*   [Mastering React Folder Structures: Your Ultimate Guide to Scalable and Maintainable Projects](https://medium.com/@deltaromeoyanki/mastering-react-folder-structures-your-ultimate-guide-to-scalable-and-maintainable-projects-5e200d630025)

