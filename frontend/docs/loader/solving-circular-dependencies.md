# Hướng dẫn Giải quyết Phụ thuộc Vòng tròn (Circular Dependency) trong CRUD Routes

## 1. Bối cảnh và Vấn đề

Khi xây dựng các module CRUD theo phương pháp "Generator" của chúng ta, một vấn đề phổ biến có thể phát sinh là **phụ thuộc vòng tròn (circular dependency)**. Vấn đề này xảy ra do cấu trúc sau:

1.  **File Route** (ví dụ: `inventory.routes.ts`) cần import các **Component Trang** (ví dụ: `InventoryDetailPage`) để đưa vào "Bản thiết kế" (definition) của route.
2.  **Component Trang** (ví dụ: `InventoryDetailPage.tsx`) lại cần import **File Route** (ví dụ: `inventoryRoutes`) để sử dụng các hook an toàn kiểu (type-safe) như `useLoaderData`, `useParams`.

Sơ đồ phụ thuộc:

```
+---------------------------+         +----------------------------+
|   inventory.routes.ts     | ------> |  InventoryDetailPage.tsx   |
| (imports Page Component)  |         | (imports inventoryRoutes)  |
+---------------------------+ <------ +----------------------------+
```

Sự phụ thuộc hai chiều này khiến cho trình biên dịch TypeScript không thể suy luận chính xác kiểu dữ liệu, dẫn đến các lỗi như `Property 'detail' does not exist on type 'ModuleRoutes<...>'` mặc dù logic có vẻ đúng.

## 2. Giải pháp: Phá vỡ Vòng lặp

Để giải quyết vấn đề này, chúng ta áp dụng một giải pháp gồm hai bước chính: tách biệt "Bản thiết kế" và sử dụng một "placeholder" export.

### Bước 1: Tách "Bản thiết kế" ra file riêng (`.definition.ts`)

Chúng ta di chuyển toàn bộ phần logic định nghĩa của module (types, hàm fetch, và quan trọng nhất là object `...ModuleDefinition`) ra một file riêng có hậu tố là `.definition.ts`.

*   **File mới:** `inventory.definition.ts`

File này sẽ chứa tất cả các import đến component trang và các hàm loader. Nó trở thành trung tâm logic của module.

### Bước 2: Cập nhật File Route (`.routes.ts`)

File route ban đầu giờ đây sẽ có vai trò đơn giản hơn rất nhiều:

1.  **Export một Object Tạm thời (Placeholder):** Chúng ta export một biến rỗng với kiểu `any`. Thao tác này cung cấp một "đích đến" cho các file trang import vào mà không gây ra lỗi phụ thuộc ngay lập tức.
2.  **Import "Bản thiết kế":** Import `...ModuleDefinition` từ file `.definition.ts`.
3.  **Tạo Route và Gán giá trị:** Gọi hàm `generateCRUDRoutes` như bình thường, sau đó sử dụng `Object.assign()` để "tiêm" các thuộc tính của route đã được tạo (`list`, `detail`, `create`, `edit`) vào object tạm thời đã được export.

## 3. Ví dụ Minh họa

#### `frontend/src/app/routes/modules/inventory.definition.ts` (File mới)

```typescript
import { z } from 'zod';
import { baseSearchSchema, type CrudModuleDefinition } from '../type/types';
// Import các trang ở đây
import { InventoryListPage } from '../../../features/inventory/pages/InventoryListPage';
import { InventoryDetailPage } from '../../../features/inventory/pages/InventoryDetailPage';
// ... (các hàm fetch, type, và definition object)

export const inventoryModuleDefinition: CrudModuleDefinition<...> = {
  entityName: 'kho hàng',
  basePath: '/admin/inventory',
  components: {
    list: InventoryListPage,
    detail: InventoryDetailPage,
    // ...
  },
  // ...
};
```

#### `frontend/src/app/routes/modules/inventory.routes.ts` (File được cập nhật)

```typescript
import { createModuleRoutes } from '../type/types';
import { generateCRUDRoutes } from '../utils/routeHelpers';
import { inventoryModuleDefinition } from './inventory.definition';

// Bước 1: Export một object tạm thời với kiểu 'any'
export const inventoryRoutes: any = {};

// Bước 2: Tạo các route thực tế
const generatedRoutes = createModuleRoutes(
  'inventory',
  '/admin/inventory',
  generateCRUDRoutes(inventoryModuleDefinition)
);

// Bước 3: Gán các thuộc tính từ route đã tạo vào object tạm thời
Object.assign(inventoryRoutes, generatedRoutes);
```

#### `frontend/src/features/inventory/pages/InventoryDetailPage.tsx` (Không thay đổi)

File trang vẫn import `inventoryRoutes` như bình thường. Nhờ kỹ thuật `Object.assign`, tại thời điểm runtime, `inventoryRoutes` sẽ có đầy đủ các thuộc tính cần thiết.

```typescript
import { inventoryRoutes } from '../../../app/routes/modules/inventory.routes';

export function InventoryDetailPage() {
  // ✅ Hoạt động bình thường!
  const { id } = inventoryRoutes.detail.useParams();
  const data = inventoryRoutes.detail.useLoaderData();

  return (
    // ...
  );
}
```

## 4. Kết luận

Bằng cách tách riêng file `.definition.ts` và sử dụng placeholder export với `Object.assign`, chúng ta đã phá vỡ thành công sự phụ thuộc vòng tròn, cho phép TypeScript suy luận đúng kiểu dữ liệu và đảm bảo trải nghiệm phát triển (DX) tốt nhất với các hook type-safe của TanStack Router.
