# Ghi chú sửa lỗi: Routing và Mock Data (Orders)

Tài liệu này mô tả hai lỗi chính đã gặp phải trong module Orders và cách khắc phục:

- Lỗi điều hướng (navigate) không đổi trang dù URL thay đổi
- Tạo/Sửa đơn hàng không cập nhật mock data trong danh sách

## 1) Lỗi điều hướng: URL đổi nhưng UI không đổi

### Triệu chứng

- Click "Tạo đơn hàng" log ra `Navigating to: /admin/orders/create` nhưng giao diện vẫn đứng ở `/admin/orders`.
- Console có thể báo lỗi dạng:
    - Detected cycle while resolving name 'adminLayoutRoute'
    - Multiple exports with the same name "adminLayoutRoute"

### Nguyên nhân gốc rễ

1. Circular export do tồn tại song song hai file:
    - `src/app/routes/modules/layout/admin.layout.ts`
    - `src/app/routes/modules/layout/admin.layout.tsx`
      Trình resolve module chọn nhầm `.ts` (re-export) và dẫn đến vòng lặp, khiến router crash âm thầm, UI không render trang mới.

2. Kiến trúc route CRUD được nested (lồng): `create`, `detail`, `edit` là con của `list`. Khi điều hướng đến route con, nếu route cha (list) không render `<Outlet />`, UI vẫn đứng ở component list.

### Cách khắc phục

- Giữ DUY NHẤT file TSX có component layout và `<Outlet />`:
    - [x] Xóa file: `frontend/src/app/routes/modules/layout/admin.layout.ts`
    - [x] Tạo/giữ file: `frontend/src/app/routes/modules/layout/admin.layout.tsx`

- Nội dung `admin.layout.tsx` (rút gọn):

```tsx
import { createRoute, Outlet } from '@tanstack/react-router'
import { rootRoute } from '../../__root'

export const adminLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: () => <Outlet />,
})
```

- Đảm bảo các route CRUD hoạt động dạng "ngang hàng" dưới `/admin` (không phụ thuộc `<Outlet />` của List), hoặc nếu tiếp tục nested thì List cần tự render `<Outlet />`.

Hiện tại, hệ thống đã cấu hình các route CRUD Orders ở dạng ngang hàng (sibling) thông qua `routeHelpers`:

- `/admin/orders` → List
- `/admin/orders/create` → Create
- `/admin/orders/$id` → Detail
- `/admin/orders/$id/edit` → Edit

Xem: `frontend/src/app/routes/utils/routeHelpers.ts` (đã trả về `[listConfig, createConfig, detailConfig, editConfig]`).

### Cách kiểm tra

1. Chạy dev server:
    ```bash
    npm run dev
    ```
2. Mở `/admin/orders` → Click "Tạo đơn hàng" → chuyển sang `/admin/orders/create` và UI hiển thị trang tạo đơn.
3. Quay lại danh sách → điều hướng tới chi tiết/sửa và UI thay đổi tương ứng.

---

## Phụ lục: Phân biệt Sibling vs Nested & vì sao cần `<Outlet />`

### 1. Hai mô hình tổ chức route

| Mô hình | Cấu trúc                                               | Khi vào `/admin/orders/create` sẽ render            | Cần `<Outlet />` ở đâu              |
| ------- | ------------------------------------------------------ | --------------------------------------------------- | ----------------------------------- |
| Nested  | `/admin/orders` là CHA của `create`, `$id`, `$id/edit` | `AdminLayout` → `OrderListPage` → `OrderCreatePage` | 1) `AdminLayout` 2) `OrderListPage` |
| Sibling | Tất cả trang là con trực tiếp của `/admin`             | `AdminLayout` → `OrderCreatePage`                   | Chỉ `AdminLayout`                   |

### 2. Sơ đồ trực quan

Nested (lồng):

```
admin (/admin)
    └─ orders (/admin/orders)
             ├─ create (/admin/orders/create)
             ├─ $id (/admin/orders/123)
             └─ $id/edit (/admin/orders/123/edit)
```

Sibling (ngang hàng):

```
admin (/admin)
    ├─ /admin/orders
    ├─ /admin/orders/create
    ├─ /admin/orders/$id
    └─ /admin/orders/$id/edit
```

### 3. Vì sao nested dễ “URL đổi mà UI không đổi”

Trong mô hình nested, Router muốn render CHUỖI component cha → con. Nếu route cha (ví dụ `OrderListPage`) thiếu `<Outlet />`, component con (create/detail/edit) KHÔNG có vị trí để hiển thị. URL vẫn đổi vì history được push, nhưng UI không thay đổi.

### 4. Khi nào chọn mô hình nào?

Chọn Nested khi bạn:

- Muốn giữ nguyên state/filter của list khi vào detail/edit.
- Muốn reuse loader/beforeLoad/guard ở cấp list.

Chọn Sibling khi bạn:

- Muốn cấu trúc rõ ràng, ít bẫy, dễ debug.
- Không cần giữ state list khi rời trang.

### 5. `<Link>` vs `router.navigate()` KHÔNG liên quan tới nested/sibling

- Cả hai chỉ là hai cách điều hướng (declarative vs imperative).
- Không cái nào tự “sửa” việc thiếu `<Outlet />`.
- Nếu nested thiếu `<Outlet />`, đổi từ `navigate()` sang `<Link>` vẫn không hiển thị trang con.

### 6. Checklist nhanh

| Trường hợp                     | Hỏi                                        | Trả lời                             |
| ------------------------------ | ------------------------------------------ | ----------------------------------- |
| URL đổi, UI đứng yên           | Route cha có con nhưng thiếu `<Outlet />`? | Thêm `<Outlet />`                   |
| Sibling mà vẫn không render    | Sai path hoặc route chưa add vào tree?     | Kiểm tra khai báo trong `routeTree` |
| Muốn giữ filter khi xem detail | Dùng nested + `<Outlet />`                 | ✔                                  |
| Không cần giữ state            | Dùng sibling                               | ✔                                  |

### 7. Code mẫu chuyển từ Nested → Sibling

Nested cũ (rút gọn):

```ts
const listConfig = createHierarchicalRouteConfig({
    path: basePath,
    component: OrderListPage,
    children: [detailConfig, createConfig, editConfig],
})
return [listConfig]
```

Sibling hiện tại:

```ts
return [listConfig, createConfig, detailConfig, editConfig]
```

Nếu giữ nested → thêm vào cuối `OrderListPage`:

```tsx
import { Outlet } from '@tanstack/react-router'
// ...
;<Outlet />
```

---

## 2) Mock data không cập nhật sau Tạo/Sửa

### Triệu chứng

- Sau khi tạo đơn hàng (Create) hoặc đổi trạng thái (Edit), quay về danh sách vẫn không thấy thay đổi.

### Nguyên nhân

- Dữ liệu đang lấy từ `_mocks/orders.ts` (mảng tĩnh). Trước đây Create/Edit chỉ `console.log` và `navigate`, KHÔNG mutate vào mảng mock.
- Danh sách (List) giữ state cục bộ; nếu route con không làm unmount List (nested), state không tự reload.

### Cách khắc phục (DEV với mock)

Đã bổ sung 3 phần:

1. **Helpers để mutate mock** – `frontend/src/_mocks/orders.ts`

- Hàm `addMockOrder(order)` để push đơn mới vào mảng và tự sinh `id`.
- Hàm `updateMockOrderStatus(id, status)` để cập nhật trạng thái đơn.

2. **Event bus đơn giản** – `frontend/src/features/orders/utils/orderEvents.ts`

- `emitOrdersChanged()` phát sự kiện khi mock data thay đổi.
- `onOrdersChanged(handler)` đăng ký lắng nghe sự kiện.

3. **Tích hợp vào trang Create/Edit và List**

- `OrderCreatePage.tsx`
    - Sau khi submit: build order đầy đủ → `addMockOrder(...)` → `emitOrdersChanged()` → navigate về danh sách.
- `OrderEditPage.tsx`
    - Sau khi submit: `updateMockOrderStatus(orderId, values.status)` → `emitOrdersChanged()` → navigate về chi tiết.
- `useOrderManagement.ts`
    - `useEffect` đăng ký `onOrdersChanged` để khi có sự kiện thì `setOrders([...mockOrders])` đồng bộ lại danh sách.
    - `refreshOrders()` cũng đọc lại từ `mockOrders`.

### Cách kiểm tra

1. Từ `/admin/orders`, bấm "Tạo đơn hàng", thêm vài sản phẩm rồi bấm Tạo.
2. Bạn sẽ được điều hướng về danh sách và thấy đơn mới xuất hiện ngay (không cần reload trang).
3. Vào trang sửa, đổi trạng thái → quay lại chi tiết/danh sách → trạng thái đã cập nhật.

### Ghi chú

- Đây là giải pháp phục vụ môi trường DEV với mock. Khi chuyển sang API thật:
    - Thay `addMockOrder/updateMockOrderStatus` bằng gọi `orderApi.*`
    - List/Detail lấy dữ liệu từ loader/store hoặc API, không đọc trực tiếp từ `_mocks/*`.

---

## Troubleshooting nhanh

- Vẫn không điều hướng được:
    - Kiểm tra còn file `admin.layout.ts` không (phải chỉ còn `admin.layout.tsx`).
    - Xem console có lỗi “Detected cycle…” hoặc “Multiple exports…” không.
- Danh sách không thấy cập nhật:
    - Mở console, đảm bảo có log `emitOrdersChanged` (có thể thêm tạm `console.log`).
    - Trong `useOrderManagement`, kiểm tra `onOrdersChanged` có đang chạy (cũng có thể thêm `console.log`).

## File ảnh hưởng chính

- `src/app/routes/modules/layout/admin.layout.tsx`
- `src/app/routes/utils/routeHelpers.ts`
- `src/_mocks/orders.ts`
- `src/features/orders/utils/orderEvents.ts`
- `src/features/orders/pages/OrderCreatePage.tsx`
- `src/features/orders/pages/OrderEditPage.tsx`
- `src/features/orders/hooks/useOrderManagement.ts`
