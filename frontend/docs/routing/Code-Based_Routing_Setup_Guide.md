**TanStack Router và plugin Vite của nó không hỗ trợ quét nhiều thư mục khác nhau để tự động tạo route.**

Qua các tài liệu, tôi nhận thấy một nguyên tắc cốt lõi không thay đổi của TanStack Router:

1. **"Automation" dựa trên việc đọc các `Route` đã export:** Sự "tự động" của TanStack Router nằm ở việc nó quét thư mục (`src/app/routes` trong trường hợp của chúng ta), tìm tất cả các file có `export const Route = ...`, và tự động **xây dựng cây định tuyến (route tree)** từ chúng. Nó giúp bạn không phải nối các route lại với nhau bằng tay.
2. **`createFileRoute` là bắt buộc:** Việc export một đối tượng được tạo bởi `createFileRoute` (hoặc các hàm tương tự như `createLazyFileRoute`) là cách duy nhất để bạn "khai báo" một route cho hệ thống. Đây là một quyết định thiết kế có chủ ý của thư viện.

### Tại sao TanStack Router lại yêu cầu điều này?

Việc yêu cầu một file định nghĩa riêng biệt, dù rất mỏng, mang lại nhiều lợi ích và sức mạnh mà việc chỉ quét component không có được:

- **Cấu hình nâng cao cho Route:** File định nghĩa là nơi bạn cấu hình các tính năng mạnh mẽ cho từng route một cách rõ ràng, ví dụ:

  - **Data Loaders:** `loader` để tải dữ liệu trước khi component render.
  - **Search Param Validation:** `validateSearch` để xác thực và định kiểu cho các tham số trên URL (ví dụ: `?sort=asc`).
  - **Pending/Error Components:** Cung cấp component hiển thị khi dữ liệu đang tải hoặc có lỗi.
  - **Authentication Checks:** Thêm logic `beforeLoad` để kiểm tra quyền truy cập trước khi vào route.

  Nếu chỉ có file component, sẽ không có một nơi hợp lý và rõ ràng để định nghĩa các logic này.

- **Tách biệt trách nhiệm rõ ràng:** Như chúng ta đã thảo luận, cách làm này giúp tách biệt hoàn toàn logic định tuyến (URL là gì, tải dữ liệu gì, ai được vào) khỏi logic hiển thị (trông như thế nào, tương tác ra sao). Đây là một nguyên tắc kiến trúc phần mềm rất tốt.

Plugin được thiết kế để chỉ định một thư mục gốc duy nhất (`routesDirectory`) và nó sẽ xây dựng cây định tuyến dựa trên cấu trúc bên trong thư mục đó. Đây là một quyết định thiết kế có chủ ý để giữ cho cơ chế hoạt động đơn giản và dễ đoán.

### Giải pháp: Kết hợp "Thin Route Files" và FSD

Đây là cách làm tốt nhất để dung hòa giữa yêu cầu của TanStack Router và kiến trúc FSD.

**Quy trình chuẩn để tạo một trang chi tiết sản phẩm (`/products/:id`):**

#### Bước 1: Tạo Component Trang trong thư mục `features`

Đây là nơi chứa toàn bộ giao diện và logic của trang.

1.  **Tạo file:** `frontend/src/features/products/pages/ProductDetailsPage.tsx`
2.  **Viết code cho component:**

    ```tsx
    // File: frontend/src/features/products/pages/ProductDetailsPage.tsx
    import { useParams } from '@tanstack/react-router'
    // Import route để lấy params một cách type-safe
    import { route } from '../../app/routes/products/$productId'
    
    export function ProductDetailsPage() {
      // Lấy `productId` từ URL một cách an toàn về kiểu
      const { productId } = route.useParams()
    
      // (Logic để fetch và hiển thị dữ liệu cho sản phẩm có id = productId)
    
      return (
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Chi tiết sản phẩm</h2>
          <p className="mt-2 text-gray-600">
            Đang hiển thị thông tin cho sản phẩm có ID: {productId}
          </p>
        </div>
      )
    }
    ```

#### Bước 2: Tạo File Định nghĩa Route "Mỏng" trong `src/app/routes`

File này chỉ có một nhiệm vụ duy nhất: "khai báo" đường dẫn cho TanStack Router và chỉ cho nó component nào cần render.

1.  **Tạo thư mục và file:** `frontend/src/app/routes/products/$productId.tsx`
    *   Thư mục `products` tạo ra segment `/products`.
    *   File `$productId.tsx` tạo ra segment động `/:productId`.

2.  **Viết code định nghĩa route:**

    ```tsx
    // File: frontend/src/app/routes/products/$productId.tsx
    
    import { createFileRoute } from '@tanstack/react-router'
    // Import component trang từ đúng vị trí trong features
    import { ProductDetailsPage } from '../../../features/products/pages/ProductDetailsPage'
    
    // Dòng này khai báo route '/products/$productId' và liên kết nó với component
    export const Route = createFileRoute('/products/$productId')({
      component: ProductDetailsPage,
    })
    ```

### Tại sao cách này lại là giải pháp tốt nhất?

1.  **Tuân thủ FSD:** Mã nguồn chính của trang (`ProductDetailsPage.tsx`) vẫn nằm gọn gàng bên trong `features/products`, đúng như triết lý FSD.
2.  **Tuân thủ TanStack Router:** Bạn vẫn cung cấp cho TanStack Router một file định nghĩa trong `src/app/routes` để nó có thể quét và xây dựng cây định tuyến.
3.  **Tách biệt rõ ràng:**
    *   `src/app/routes`: Trở thành "bản đồ" của ứng dụng. Nhìn vào đây bạn biết ngay ứng dụng có những URL nào.
    *   `src/features/.../pages`: Là nơi triển khai chi tiết cho các URL đó.
4.  **Hỗ trợ đầy đủ tính năng:** Cách làm này cho phép bạn dễ dàng thêm các cấu hình nâng cao cho route (như `loader`, `beforeLoad`...) ngay trong file định nghĩa mà không làm "bẩn" component trang của bạn.

