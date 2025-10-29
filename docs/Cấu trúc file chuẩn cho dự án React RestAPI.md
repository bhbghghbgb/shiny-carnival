# Cấu trúc file chuẩn cho dự án React RestAPI

## Giới thiệu

Tài liệu này mô tả cấu trúc file được đề xuất cho một dự án React RestAPI sử dụng các công nghệ như Tailwind CSS, Axios, Ant Design, TanStack Table, Zustand và **TanStack Router** cho việc định tuyến.

Cấu trúc này được thiết kế dựa trên các nguyên tắc của Clean Architecture và Feature-Sliced Design (FSD) nhằm đảm bảo tính **clean**, **khả năng mở rộng (scalability)**, **tái sử dụng (reusability)** và **dễ bảo trì (maintainability)**.

## Các nguyên tắc thiết kế chính

1.  **Separation of Concerns (Tách biệt các mối quan tâm):** Mỗi phần của ứng dụng có một trách nhiệm rõ ràng và độc lập, giảm thiểu sự phụ thuộc lẫn nhau.
2.  **Domain-Driven Design (Thiết kế hướng theo nghiệp vụ):** Tổ chức code theo các tính năng hoặc nghiệp vụ (domain) thay vì theo loại kỹ thuật (components, services).
3.  **Clean Architecture:** Đảm bảo lớp nghiệp vụ (business logic) độc lập với các chi tiết triển khai (UI, database, API).
4.  **Scalability & Reusability:** Dễ dàng thêm tính năng mới mà không ảnh hưởng lớn đến các phần hiện có, và cho phép tái sử dụng các module trên nhiều dự án.
5.  **Testability:** Cấu trúc rõ ràng giúp việc viết và chạy unit/integration tests hiệu quả hơn.

## Cấu trúc thư mục tổng quan

```
src/
├── app/                  // Cấu hình ứng dụng toàn cục, store, và định nghĩa routing
│   └── routes/           // Chứa các file định nghĩa route "mỏng"
├── assets/               // Tài nguyên tĩnh (ảnh, font, icon)
├── components/           // Các UI component dùng chung (presentational components)
├── config/               // Cấu hình môi trường, hằng số
├── constants/            // Các hằng số được sử dụng trong ứng dụng
├── features/             // Các module tính năng/nghiệp vụ chính (feature-sliced)
├── hooks/                // Custom React Hooks dùng chung
├── layouts/              // Bố cục trang (layout components)
├── lib/                  // Thư viện tiện ích, helpers, cấu hình Axios
├── pages/                // Chứa các component trang dùng chung (HomePage, AboutPage,...)
├── types/                // Định nghĩa kiểu dữ liệu TypeScript dùng chung
└── utils/                // Các hàm tiện ích chung
```

## Giải thích chi tiết từng thư mục

### `src/app/`

Chứa các file cấu hình và khởi tạo cấp ứng dụng. Đây là nơi tập trung các cài đặt toàn cục.

*   `main.tsx`: Điểm khởi chạy của ứng dụng (entry point), nơi React DOM được render và **TanStack Router** được khởi tạo.
*   `routes/`: Thư mục chứa các file định nghĩa route cho cơ chế **file-based routing** của TanStack Router. Mỗi file trong đây là một định nghĩa "mỏng", liên kết một URL với một component trang cụ thể.
*   `routeTree.gen.ts`: File được **TanStack Router** tự động tạo ra, chứa toàn bộ cây định tuyến của ứng dụng. **Không được chỉnh sửa file này bằng tay.**
*   `store.ts`: Cấu hình Zustand store toàn cục (nếu có).

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

Chứa các component trang **dùng chung**, không thuộc về một feature cụ thể nào. Đây là nơi chứa giao diện và logic hiển thị cho các trang như trang chủ, giới thiệu, liên hệ.

*   `HomePage.tsx`
*   `AboutPage.tsx`
*   `NotFoundPage.tsx`

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

## Quy trình tạo một trang mới (Data Flow & Routing)

Với cấu trúc sử dụng **TanStack Router**, luồng tạo và hiển thị một trang mới được thực hiện qua hai bước chính, tách biệt rõ ràng giữa định nghĩa định tuyến và logic giao diện:

**Bước 1: Tạo Component Trang (UI & Logic Layer)**

Component giao diện của trang được đặt ở nơi phù hợp theo kiến trúc FSD:

*   **Nếu là trang dùng chung:** Tạo file component trong `src/pages/`. Ví dụ: `src/pages/AboutPage.tsx`.
*   **Nếu là trang thuộc một tính năng:** Tạo file component trong `src/features/[feature-name]/pages/`. Ví dụ: `src/features/products/pages/ProductDetailsPage.tsx`.

**Bước 2: Tạo File Định nghĩa Route (Routing Definition Layer)**

Để TanStack Router nhận biết trang mới, bạn cần tạo một file định nghĩa route "mỏng" tương ứng trong `src/app/routes/`.

*   **Tạo file route:** Tên và cấu trúc thư mục của file này sẽ quyết định URL của trang. Ví dụ, để tạo route `/products/:productId`, bạn tạo file `src/app/routes/products/$productId.tsx`.
*   **Liên kết với component:** Trong file route vừa tạo, sử dụng `createFileRoute` hoặc `createLazyFileRoute` để liên kết URL với component đã tạo ở Bước 1.

**Ví dụ luồng hoàn chỉnh cho trang chi tiết sản phẩm:**

1.  **Tạo Component:** Tạo file `src/features/products/pages/ProductDetailsPage.tsx` chứa UI và logic để hiển thị chi tiết sản phẩm.
2.  **Tạo Định nghĩa Route:** Tạo file `src/app/routes/products/$productId.tsx` với nội dung:
    ```tsx
    import { createFileRoute } from '@tanstack/react-router';
    import { ProductDetailsPage } from '../../../features/products/pages/ProductDetailsPage';

    export const Route = createFileRoute('/products/$productId')({
      component: ProductDetailsPage,
    });
    ```
3.  **Tự động hóa:** **TanStack Router** sẽ tự động phát hiện file route mới này, cập nhật `routeTree.gen.ts`, và ứng dụng sẽ có route `/products/:productId` hoạt động.

## Kết luận

Cấu trúc file này cung cấp một nền tảng vững chắc cho việc phát triển các ứng dụng React RestAPI có khả năng mở rộng và dễ bảo trì. Bằng cách sử dụng **TanStack Router** và tuân thủ các nguyên tắc tách biệt mối quan tâm, tổ chức code theo tính năng, dự án của bạn sẽ trở nên dễ quản lý hơn, đặc biệt khi quy mô ứng dụng và số lượng thành viên trong nhóm phát triển tăng lên.

## Tài liệu tham khảo

*   [TanStack Router Docs](https://tanstack.com/router/latest)
*   [Clean Architecture in React](https://alexkondov.com/full-stack-tao-clean-architecture-react/)
*   [Feature-Sliced Design](https://feature-sliced.design/)

