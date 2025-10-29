### Ví dụ về cách điều hướng chuẩn và Type-Safe

Giả sử chúng ta có một route động để hiển thị chi tiết một bài viết, với đường dẫn là `/posts/$postId` và có thể nhận các tham số tìm kiếm để lọc bình luận.

**Bước 1: Định nghĩa Route và Validation cho Search Params**

Chúng ta sẽ sử dụng Zod để xác thực (validate) các tham số tìm kiếm. Đây là cách làm được khuyến khích để đảm bảo type-safety.

```typescript
// src/routes/posts/$postId.tsx

import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

// Định nghĩa schema để validate search params
const postSearchSchema = z.object({
  showComments: z.boolean().optional().default(true),
  commentsFilter: z.enum(['newest', 'popular']).optional().default('newest'),
})

export const Route = createFileRoute('/posts/$postId')({
  // Sử dụng schema để validate và cung cấp type cho search params
  validateSearch: postSearchSchema,
  component: PostComponent,
})

function PostComponent() {
  // `useParams` sẽ có kiểu an toàn: { postId: string }
  const { postId } = Route.useParams()
  
  // `useSearch` sẽ có kiểu an toàn từ schema: 
  // { showComments: boolean, commentsFilter: 'newest' | 'popular' }
  const { showComments, commentsFilter } = Route.useSearch()

  return (
    <div>
      <h1>Post ID: {postId}</h1>
      <p>Show Comments: {showComments ? 'Yes' : 'No'}</p>
      <p>Comments Filter: {commentsFilter}</p>
      {/* ... */}
    </div>
  )
}
```

**Bước 2: Điều hướng bằng Component `<Link>`**

Bây giờ, từ một component khác, bạn có thể tạo link đến route trên một cách hoàn toàn type-safe.

```tsx
import { Link } from '@tanstack/react-router'

function PostListComponent() {
  const postId = 'mot-bai-viet-hay'

  return (
    <nav>
      <Link
        to="/posts/$postId"
        // ✅ Type-safe: TypeScript biết rằng `postId` là bắt buộc và phải là string
        params={{
          postId: postId,
        }}
        // ✅ Type-safe: TypeScript sẽ gợi ý và kiểm tra các search params
        search={{
          showComments: true,
          commentsFilter: 'popular',
        }}
        // ❌ Nếu bạn gõ sai, ví dụ `commentFilter` thay vì `commentsFilter`,
        // TypeScript sẽ báo lỗi ngay lập tức.
      >
        Xem bài viết
      </Link>
    </nav>
  )
}
```

**Bước 2.22: Điều hướng bằng Hook `useNavigate` (Programmatic Navigation)**

Tương tự, khi cần điều hướng trong một hàm (ví dụ: sau khi submit form), bạn có thể dùng hook `useNavigate`.

```tsx
import { useNavigate } from '@tanstack/react-router'
// Giả sử chúng ta đang ở trong một route khác, ví dụ /dashboard
import { routeApi as dashboardRouteApi } from '../routes/dashboard'

function SomeComponent() {
  const navigate = useNavigate({ from: dashboardRouteApi.fullPath })

  const handleNavigate = () => {
    navigate({
      to: '/posts/$postId',
      // ✅ Type-safe params
      params: {
        postId: 'mot-bai-viet-khac',
      },
      // ✅ Type-safe search
      search: {
        showComments: false,
      },
      // `commentsFilter` sẽ tự động dùng giá trị mặc định là 'newest'
    })
  }

  return <button onClick={handleNavigate}>Điều hướng tới bài viết khác</button>
}
```

Bằng cách này, bạn đã tận dụng tối đa sức mạnh của TanStack Router, giúp code của bạn an toàn, dễ bảo trì và dễ dàng tái cấu trúc hơn rất nhiều.



### 4. Một số lưu ý bổ sung về Best Practices

**Cập nhật Search Params một cách thông minh:**

```tsx
// ✅ Tốt: Giữ lại các search params hiện tại và chỉ cập nhật những gì cần thiết
<Link 
  to="/posts/$postId" 
  params={{ postId }}
  search={(prev) => ({ ...prev, page: prev.page + 1 })}
>
  Trang tiếp theo
</Link>

// ❌ Tránh: Thay thế toàn bộ search params
<Link 
  to="/posts/$postId" 
  params={{ postId }}
  search={{ page: 2 }} // Sẽ mất tất cả search params khác
>
  Trang 2
</Link>
```

**Sử dụng Route API để tối ưu performance:**

```tsx
// Thay vì dùng global hooks
const navigate = useNavigate({ from: Route.fullPath })
const params = useParams({ from: Route.fullPath })

// Nên dùng Route-specific hooks (nhanh hơn)
const navigate = Route.useNavigate()
const params = Route.useParams()
```

**Xử lý Optional Parameters:**

```tsx
// Route definition với optional params
// /posts/{-$category} - category là optional

<Link 
  to="/posts/{-$category}"
  params={{ category: 'tech' }} // Có category
>
  Tech Posts
</Link>

<Link 
  to="/posts/{-$category}"
  params={{ category: undefined }} // Không có category
>
  All Posts
</Link>
```