# Phân tích Nội dung: Định Tuyến Dựa trên Mã (Code-Based Routing) trong TanStack Router

## 1. Giới Thiệu Chung

Tài liệu này cung cấp hướng dẫn chi tiết về **Định Tuyến Dựa trên Mã (Code-Based Routing)** trong thư viện `@tanstack/react-router`. Mặc dù tài liệu khuyến nghị sử dụng **Định Tuyến Dựa trên Tệp (File-Based Routing)** cho hầu hết các ứng dụng, nó vẫn giải thích cách triển khai định tuyến dựa trên mã, đặc biệt nhấn mạnh sự tương đồng về khái niệm cây định tuyến (route tree) và các khác biệt trong cách tổ chức.

## 2. Các Khái Niệm Chính

### 2.1. Cây Định Tuyến (Route Trees)

Cả định tuyến dựa trên mã và dựa trên tệp đều sử dụng khái niệm cây định tuyến để tổ chức, khớp và kết hợp các tuyến đường thành một cây thành phần. Điểm khác biệt chính là định tuyến dựa trên mã sử dụng code để tổ chức các tuyến thay vì hệ thống tệp.

### 2.2. Cấu Trúc của một Tuyến (Anatomy of a Route)

Các tuyến (ngoại trừ tuyến gốc) được cấu hình bằng hàm `createRoute`. Một thành phần quan trọng là tùy chọn `getParentRoute`, một hàm trả về tuyến cha của tuyến đang được tạo. Việc này rất quan trọng để đảm bảo **an toàn kiểu dữ liệu (type safety)** của TanStack Router.

> [!IMPORTANT]
> Đối với mọi tuyến **KHÔNG phải là Tuyến Gốc (Root Route)** hoặc **Tuyến Bố Cục Không Đường Dẫn (Pathless Layout Route)**, tùy chọn `path` là bắt buộc. `path` sẽ được so khớp với URL để xác định tuyến phù hợp.

TanStack Router sẽ tự động chuẩn hóa các đường dẫn, bỏ qua các dấu gạch chéo đầu và cuối (trừ đường dẫn `/` cho tuyến index).

### 2.3. Xây Dựng Cây Định Tuyến Thủ Công

Trong định tuyến dựa trên mã, việc xây dựng cây định tuyến đòi hỏi phải thêm từng tuyến vào mảng `children` của tuyến cha tương ứng. Điều này khác với định tuyến dựa trên tệp, nơi cây định tuyến được xây dựng tự động.

## 3. Các Loại Tuyến trong Định Tuyến Dựa trên Mã

Tài liệu giả định người đọc đã quen thuộc với các khái niệm định tuyến cơ bản và sau đó giải thích cách tạo từng loại tuyến trong code:

*   **Tuyến Gốc (The Root Route):** Được tạo bằng `createRootRoute()` hoặc `createRootRouteWithContext()` để thêm ngữ cảnh. Không bắt buộc phải xuất (export) tuyến gốc.
*   **Tuyến Cơ Bản (Basic Routes):** Tạo bằng cách cung cấp một chuỗi `path` thông thường cho hàm `createRoute`. Ví dụ: `path: 'about'` sẽ khớp với URL `/about`.
*   **Tuyến Index (Index Routes):** Sử dụng một dấu gạch chéo đơn `/` trong tùy chọn `path` để biểu thị tuyến index. Ví dụ: `path: '/'` cho tuyến index của một tuyến cha `posts` sẽ khớp với `/posts/` hoặc `/posts`.
*   **Phân Đoạn Tuyến Động (Dynamic Route Segments):** Tương tự như định tuyến dựa trên tệp, tiền tố `$` được sử dụng để đánh dấu một phân đoạn động (ví dụ: `$postId`). Giá trị này sẽ được thu thập vào đối tượng `params` của `loader` hoặc `component`.
*   **Tuyến Splat / Catch-All (Splat / Catch-All Routes):** Cũng hoạt động tương tự, sử dụng `$` ở cuối đường dẫn (ví dụ: `path: '$'`) để bắt tất cả các phân đoạn còn lại vào khóa `_splat` trong đối tượng `params`.
*   **Tuyến Bố Cục (Layout Routes):** Một tuyến bao bọc các tuyến con của nó trong một thành phần bố cục. Điều này đạt được bằng cách lồng một tuyến dưới một tuyến khác và gán một `component` cho tuyến cha đó.
*   **Tuyến Bố Cục Không Đường Dẫn (Pathless Layout Routes):** Trong định tuyến dựa trên mã, đây là một tuyến chỉ có `id` thay vì `path`. Các tuyến con của nó sẽ được hiển thị bên trong thành phần bố cục của tuyến không đường dẫn này.
*   **Tuyến Không Lồng (Non-Nested Routes):** Để tạo các tuyến không lồng, cần xây dựng tuyến và cây định tuyến với các đường dẫn và cấu trúc lồng ghép phù hợp. Tuyến con sẽ được thêm trực tiếp vào tuyến gốc hoặc tuyến cha mong muốn với đường dẫn đầy đủ.

## 4. Ví dụ Code và Giải thích

### 4.1. Định nghĩa Cây Tuyến Cơ bản

Đoạn code sau minh họa cách định nghĩa một cây tuyến cơ bản bằng cách sử dụng các hàm `createRootRoute` và `createRoute`:

```tsx
import { createRootRoute, createRoute } from '@tanstack/react-router'

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'about',
})

const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts',
})

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/',
})

const postRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '$postId',
})

const postEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts/$postId/edit',
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'settings',
})

const profileRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'profile',
})

const notificationsRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: 'notifications',
})

const pathlessLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'pathlessLayout',
})

const pathlessLayoutARoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: 'route-a',
})

const pathlessLayoutBRoute = createRoute({
  getParentRoute: () => pathlessLayoutRoute,
  path: 'route-b',
})

const filesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'files/$',
})
```

**Giải thích:**

*   `createRootRoute()`: Khởi tạo tuyến gốc của ứng dụng. Tất cả các tuyến khác đều là con cháu của tuyến này.
*   `createRoute({...})`: Định nghĩa một tuyến cụ thể. Các thuộc tính quan trọng bao gồm:
    *   `getParentRoute: () => parentRoute`: Liên kết tuyến hiện tại với tuyến cha của nó. Điều này là bắt buộc để đảm bảo an toàn kiểu dữ liệu trong TanStack Router.
    *   `path: '...'`: Xác định đường dẫn URL mà tuyến này sẽ khớp. Ví dụ: `'/'` cho tuyến index, `'about'` cho tuyến `/about`, `'$postId'` cho phân đoạn động, và `'files/$'` cho tuyến catch-all.
    *   `id: '...'`: Được sử dụng cho các tuyến bố cục không đường dẫn (pathless layout routes) thay vì `path`.

### 4.2. Xây dựng Cây Tuyến Thủ công

Sau khi định nghĩa các tuyến, chúng ta cần xây dựng cây tuyến bằng cách sử dụng phương thức `addChildren`:

```tsx
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  postsRoute.addChildren([
    postsIndexRoute,
    postRoute,
  ]),
  postEditorRoute,
  settingsRoute.addChildren([
    profileRoute,
    notificationsRoute,
  ]),
  pathlessLayoutRoute.addChildren([
    pathlessLayoutARoute,
    pathlessLayoutBRoute,
  ]),
  filesRoute.addChildren([
    fileRoute,
  ]),
])
```

**Giải thích:**

*   `rootRoute.addChildren([...])`: Phương thức này được gọi trên `rootRoute` để thêm các tuyến con cấp cao nhất. Mỗi tuyến con có thể tự thêm các tuyến con của nó, tạo thành một cấu trúc cây lồng nhau.
*   `postsRoute.addChildren([...])`: Minh họa cách các tuyến con như `postsIndexRoute` và `postRoute` được lồng dưới `postsRoute`.

### 4.3. Các ví dụ khác về định nghĩa tuyến

**Tuyến cơ bản với component:**

```tsx
const route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts',
  component: PostsComponent,
})
```

**Tuyến gốc với Context:**

```tsx
import { createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

export interface MyRouterContext {
  queryClient: QueryClient
}
const rootRoute = createRootRouteWithContext<MyRouterContext>()
```

**Tuyến động (Dynamic Route Segments):**

```tsx
const postIdRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '$postId',
  // In a loader
  loader: ({ params }) => fetchPost(params.postId),
  // Or in a component
  component: PostComponent,
})

function PostComponent() {
  const { postId } = postIdRoute.useParams()
  return <div>Post ID: {postId}</div>
}
```

**Tuyến bố cục (Layout Routes):**

```tsx
const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts',
  component: PostsLayoutComponent, // The layout component
})

function PostsLayoutComponent() {
  return (
    <div>
      <h1>Posts</h1>
      <Outlet />
    </div>
  )
}

const postsIndexRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: '/',
})

const postsCreateRoute = createRoute({
  getParentRoute: () => postsRoute,
  path: 'create',
})

const routeTree = rootRoute.addChildren([
  // The postsRoute is the layout route
  // Its children will be nested under the PostsLayoutComponent
  postsRoute.addChildren([postsIndexRoute, postsCreateRoute]),
])
```

**Giải thích:** Các đoạn code trên minh họa cách định nghĩa các loại tuyến khác nhau, từ tuyến cơ bản với component, tuyến gốc có context, tuyến động để xử lý tham số URL, đến tuyến bố cục để chia sẻ giao diện giữa các tuyến con. Mỗi ví dụ đều nhấn mạnh việc sử dụng `getParentRoute` để duy trì mối quan hệ cha-con và `path` hoặc `id` để xác định cách tuyến khớp với URL hoặc được nhận dạng.

## 5. So Sánh với Định Tuyến Dựa trên Tệp

Tài liệu nhấn mạnh rằng định tuyến dựa trên tệp thực chất là một tập hợp con của định tuyến dựa trên mã, sử dụng hệ thống tệp và một lớp trừu tượng tạo mã để tự động sinh ra cấu trúc cây định tuyến. Điều này có nghĩa là định tuyến dựa trên mã cung cấp sự linh hoạt cao hơn nhưng đòi hỏi cấu hình thủ công nhiều hơn.

## 6. Kết Luận và Khuyến Nghị

**Định tuyến dựa trên mã không được khuyến nghị cho hầu hết các ứng dụng** do sự phức tạp và yêu cầu cấu hình thủ công. Tuy nhiên, nó cung cấp sự kiểm soát chi tiết hơn và là nền tảng cho định tuyến dựa trên tệp. Việc hiểu các khái niệm định tuyến cơ bản là rất quan trọng trước khi triển khai định tuyến dựa trên mã.
