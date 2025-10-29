# Loader trong TanStack Router và So sánh với Zustand

**Tác giả:** Manus AI

**Ngày:** 23 tháng 10 năm 2025

## Mục lục

- [Loader trong TanStack Router và So sánh với Zustand](#loader-trong-tanstack-router-và-so-sánh-với-zustand)
  - [Mục lục](#mục-lục)
  - [1. Giới thiệu](#1-giới-thiệu)
  - [2. Loader trong TanStack Router](#2-loader-trong-tanstack-router)
    - [2.1. Định nghĩa và Mục đích](#21-định-nghĩa-và-mục-đích)
    - [2.2. Cơ chế hoạt động](#22-cơ-chế-hoạt-động)
    - [2.3. Cách sử dụng trong React](#23-cách-sử-dụng-trong-react)
    - [2.4. Cơ chế Caching (Stale-While-Revalidate)](#24-cơ-chế-caching-stale-while-revalidate)
      - [2.4.1. Ưu điểm của Router Cache](#241-ưu-điểm-của-router-cache)
      - [2.4.2. Nhược điểm của Router Cache](#242-nhược-điểm-của-router-cache)
  - [3. Best Practices](#3-best-practices)
    - [3.1. TanStack Router Loader](#31-tanstack-router-loader)

---

## 1. Giới thiệu

Trong phát triển ứng dụng React hiện đại, việc quản lý trạng thái và tải dữ liệu hiệu quả là vô cùng quan trọng để mang lại trải nghiệm người dùng tốt nhất. Bài viết này sẽ đi sâu vào hai công cụ phổ biến giúp giải quyết các vấn đề này: **Loader trong TanStack Router** và thư viện quản lý trạng thái **Zustand**. Chúng ta sẽ tìm hiểu định nghĩa, cách sử dụng, ưu nhược điểm của từng công cụ, đồng thời so sánh chúng và đưa ra các khuyến nghị về thời điểm sử dụng cũng như các best practices để tối ưu hóa ứng dụng.

## 2. Loader trong TanStack Router

### 2.1. Định nghĩa và Mục đích

**TanStack Router Loader** là một cơ chế tích hợp sâu trong TanStack Router, được thiết kế để quản lý việc tải dữ liệu cần thiết cho một route cụ thể trước khi component của route đó được render. Mục đích chính của Loader là đảm bảo rằng tất cả các yêu cầu bất đồng bộ (async requirements) của trang được thực hiện càng sớm càng tốt và song song, giúp trang hiển thị nhanh chóng và liền mạch. Cơ chế này tương tự như `getServerSideProps` trong Next.js hoặc `loaders` trong Remix/React-Router [1].

Router là nơi lý tưởng để điều phối các phụ thuộc bất đồng bộ này vì nó thường là thành phần duy nhất trong ứng dụng biết người dùng đang điều hướng đến đâu trước khi nội dung được hiển thị.

### 2.2. Cơ chế hoạt động

Khi một thay đổi URL hoặc cập nhật lịch sử được phát hiện, TanStack Router sẽ thực hiện một chuỗi các bước trong vòng đời tải route. Các giai đoạn quan trọng liên quan đến việc tải dữ liệu bao gồm:

*   **Route Matching (Top-Down):** Router xác định các route phù hợp, phân tích `route.params.parse` và `route.validateSearch`.
*   **Route Pre-Loading (Serial):** Giai đoạn này bao gồm `route.beforeLoad` và xử lý `route.onError`.
*   **Route Loading (Parallel):** Trong giai đoạn này, hàm `route.loader` được gọi. Hàm này chịu trách nhiệm tìm nạp dữ liệu. Nếu có lỗi, `route.onError` sẽ được kích hoạt để hiển thị `errorComponent` phù hợp [1].

Hàm `loader` nhận một đối tượng làm tham số, chứa nhiều thuộc tính hữu ích như `abortController` (để hủy yêu cầu khi route không còn liên quan), `cause` (nguyên nhân kích hoạt loader: `enter`, `preload`, `stay`), `context`, `deps`, `location`, `params`, `preload`, và `route` [1].

### 2.3. Cách sử dụng trong React

Để định nghĩa một Loader, bạn cấu hình hàm `loader` trực tiếp trong định nghĩa route của mình:

```tsx
// routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
  loader: async () => {
    // Giả lập việc gọi API để lấy danh sách bài viết
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  },
})
```

Để tiêu thụ dữ liệu đã được tải từ Loader trong một component React, bạn sử dụng hook `useLoaderData` được cung cấp bởi TanStack Router:

```tsx
import React from 'react';
import { Route } from './routes/posts'; // Import định nghĩa route

function PostsPage() {
  const posts = Route.useLoaderData(); // Lấy dữ liệu từ loader của route '/posts'

  return (
    <div>
      <h1>Bài viết</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPage;
```

Trong trường hợp component của bạn nằm sâu trong cây component và không có quyền truy cập trực tiếp vào đối tượng route, bạn có thể sử dụng `getRouteApi` để truy cập `useLoaderData` một cách an toàn, tránh các vấn đề về phụ thuộc vòng tròn (circular dependencies) [1]:

```tsx
import React from 'react';
import { getRouteApi } from '@tanstack/react-router';

// Giả sử đây là một component con của PostsPage
const postsRouteApi = getRouteApi('/posts');

function PostList() {
  const posts = postsRouteApi.useLoaderData();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default PostList;
```

### 2.4. Cơ chế Caching (Stale-While-Revalidate)

TanStack Router tích hợp sẵn một lớp caching SWR (Stale-While-Revalidate) mạnh mẽ cho các route loaders. Cache này được định danh (keyed) dựa trên các yếu tố phụ thuộc của route, bao gồm pathname đã được phân tích cú pháp đầy đủ và bất kỳ phụ thuộc bổ sung nào được cung cấp thông qua tùy chọn `loaderDeps`. Điều này có nghĩa là nếu dữ liệu của một route đã có trong cache, nó sẽ được trả về ngay lập tức để hiển thị nhanh chóng, sau đó có thể được tìm nạp lại trong nền (background refetching) nếu dữ liệu đã cũ, đảm bảo người dùng luôn nhận được dữ liệu mới nhất mà không bị gián đoạn trải nghiệm [1].

Các tùy chọn cấu hình cache quan trọng bao gồm:

*   `routeOptions.loaderDeps`: Một hàm cung cấp các tham số tìm kiếm (search params) và trả về một đối tượng phụ thuộc. Khi các phụ thuộc này thay đổi, route sẽ tải lại dữ liệu bất kể `staleTime` [1].
*   `routeOptions.staleTime` / `routerOptions.defaultStaleTime`: Thời gian (miligiây) mà dữ liệu của route được coi là 

mới khi cố gắng tải [1].
*   `routeOptions.preloadStaleTime` / `routerOptions.defaultPreloadStaleTime`: Thời gian (miligiây) mà dữ liệu của route được coi là mới khi cố gắng preload [1].
*   `routeOptions.gcTime` / `routerOptions.defaultGcTime`: Thời gian (miligiây) mà dữ liệu của route được giữ trong cache trước khi bị thu gom rác [1].
*   `routeOptions.shouldReload`: Một hàm trả về boolean cho biết liệu route có nên tải lại hay không, cung cấp quyền kiểm soát cao hơn ngoài `staleTime` và `loaderDeps` [1].

#### 2.4.1. Ưu điểm của Router Cache

*   **Tích hợp sẵn:** Dễ sử dụng, không cần thêm thư viện bên ngoài [1].
*   **Quản lý toàn diện:** Xử lý deduplicating, preloading, loading, stale-while-revalidate, và refetching nền trên cơ sở từng route [1].
*   **Invalidation linh hoạt:** Cho phép hủy toàn bộ cache và route cùng lúc [1].
*   **Thu gom rác tự động:** Giúp quản lý bộ nhớ hiệu quả [1].
*   **Phù hợp với SSR:** Hoạt động tốt với Server-Side Rendering [1].
*   **Hiệu quả cho ứng dụng ít chia sẻ dữ liệu:** Lý tưởng cho các ứng dụng mà các route ít chia sẻ dữ liệu với nhau [1].

#### 2.4.2. Nhược điểm của Router Cache

*   **Không có persistence adapters/model:** Không có cơ chế tích hợp để lưu trữ cache lâu dài [1].
*   **Không chia sẻ caching/deduplicating giữa các route:** Mỗi route có cache riêng, không tối ưu cho dữ liệu dùng chung giữa nhiều route [1].
*   **API mutation hạn chế:** Không có các API mutation tích hợp mạnh mẽ như các thư viện quản lý dữ liệu khác (ví dụ: TanStack Query) [1].
*   **Không có optimistic update:** Không có API optimistic update cấp độ cache tích hợp [1].


## 3. Best Practices

### 3.1. TanStack Router Loader

1.  **Chỉ tải dữ liệu cần thiết:** Hàm `loader` chỉ nên tải dữ liệu mà route đó thực sự cần để render. Tránh tải thừa dữ liệu không liên quan để tối ưu hóa hiệu suất.
2.  **Sử dụng `loaderDeps` hiệu quả:** Tận dụng `loaderDeps` để kiểm soát chính xác khi nào loader cần chạy lại. Điều này giúp tối ưu hóa việc caching và tránh các lần gọi API không cần thiết khi các tham số không liên quan thay đổi.
3.  **Xử lý lỗi:** Luôn triển khai xử lý lỗi trong `loader` và sử dụng `errorComponent` của TanStack Router để hiển thị giao diện người dùng thân thiện khi có lỗi tải dữ liệu, thay vì làm sập toàn bộ ứng dụng.
4.  **Kết hợp với TanStack Query:** Đối với các ứng dụng có yêu cầu caching phức tạp, hãy kết hợp TanStack Router Loader với TanStack Query. Loader có thể được sử dụng để `prefetch` hoặc `fetch` một `query` của TanStack Query, tận dụng các tính năng nâng cao như caching, retry, deduplication, và optimistic updates của TanStack Query [6].
5.  **Tận dụng Preloading:** Kích hoạt tính năng preloading của TanStack Router để tải dữ liệu cho các route mà người dùng có khả năng truy cập tiếp theo (ví dụ: khi di chuột qua một liên kết), cải thiện đáng kể trải nghiệm người dùng.
6.  **Sử dụng `abortController`:** Tận dụng `abortController` được cung cấp cho loader để hủy các yêu cầu mạng không còn cần thiết khi người dùng điều hướng nhanh chóng giữa các route, giúp tiết kiệm tài nguyên.
