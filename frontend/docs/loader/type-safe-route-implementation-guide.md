# Hướng dẫn Triển khai Route Type-Safe (Phương pháp Generator)

## 1. Mục tiêu chính

Hướng dẫn này nhằm mục đích thống nhất cách chúng ta xây dựng và quản lý routes trong dự án. Bằng cách áp dụng cấu trúc mới, chúng ta sẽ tận dụng tối đa khả năng **an toàn kiểu (type-safety) từ đầu đến cuối** của TanStack Router.

**Lợi ích chính:**

*   **Giảm lỗi runtime:** TypeScript sẽ phát hiện các lỗi sai kiểu dữ liệu ngay tại thời điểm lập trình.
*   **Cải thiện Developer Experience (DX):** Tự động hoàn thành (autocomplete) và gợi ý kiểu chính xác cho `loaderData`, `params`, `search`...
*   **Code gọn gàng, dễ bảo trì:** Gom nhóm tất cả cấu hình cho một module vào một file duy nhất.

---

## 2. Tổng quan về Phương pháp "Generator"

Thay vì cấu hình từng route một cách thủ công, chúng ta sử dụng một phương pháp hiệu quả hơn:

1.  **Tạo "Bản thiết kế" (Definition):** Là một object duy nhất nơi bạn khai báo tất cả thông tin cần thiết cho một module (components, loaders, schemas...).
2.  **Sử dụng "Hàm tạo" (Generator):** Là một hàm (`generateAdminRoute` hoặc `generateCRUDRoutes`) sẽ đọc "Bản thiết kế" và tự động tạo ra các route config hoàn chỉnh và type-safe.

Chúng ta có 2 bộ công cụ chính:

*   `generateAdminRoute`: Dành cho các trang quản trị đơn lẻ (ví dụ: trang quản lý sản phẩm, trang báo cáo).
*   `generateCRUDRoutes`: Dành cho các module có đầy đủ 4 chức năng CRUD (List, Detail, Create, Edit).

---

## 3. Hướng dẫn triển khai

### 3.1. Ví dụ 1: Trang Quản trị Đơn (Sử dụng `generateAdminRoute`)

**Kịch bản:** Tạo một trang quản trị duy nhất cho **Products** có chức năng tìm kiếm và hiển thị danh sách.

**File:** `frontend/src/app/routes/modules/products.routes.ts`

```typescript
import { z } from 'zod';
import { createModuleRoutes, baseSearchSchema, type AdminRouteDefinition } from '../type/types';
import { generateAdminRoute } from '../utils/routeHelpers';
import { ProductManagementMockPage } from '../../../features/products/pages/ProductManagementMockPage';

// 1. Định nghĩa Types và API
// --------------------------
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface ProductLoaderData {
  products: Product[];
  total: number;
}

const productSearchSchema = baseSearchSchema.extend({
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
});

export type ProductSearch = z.infer<typeof productSearchSchema>;

async function fetchProducts(search: ProductSearch): Promise<ProductLoaderData> {
  console.log('Fetching products with filters:', search);
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    products: [
      { id: 'prod_1', name: 'Laptop Pro', price: 2500, category: 'Electronics', inStock: true },
      { id: 'prod_2', name: 'Mechanical Keyboard', price: 150, category: 'Accessories', inStock: false },
    ],
    total: 2,
  };
}

// 2. Tạo "Bản thiết kế" cho trang quản trị
// ----------------------------------------
const productAdminDefinition: AdminRouteDefinition<
  ProductLoaderData,     // Kiểu loader data
  ProductSearch,         // Kiểu search params
  { apiClient: any }     // Kiểu router context (ví dụ)
> = {
  entityName: 'Sản phẩm',
  path: '/admin/products',
  component: ProductManagementMockPage,
  searchSchema: productSearchSchema,
  loader: ({ search }) => fetchProducts(search),
};

// 3. Tạo Module Routes từ "Bản thiết kế"
// ----------------------------------------
export const productsRoutes = createModuleRoutes(
  'productsAdmin',
  '/admin/products',
  generateAdminRoute(productAdminDefinition)
);
```

### 3.2. Ví dụ 2: Module CRUD đầy đủ (Sử dụng `generateCRUDRoutes`)

**Kịch bản:** Tạo một module **Customers** với đầy đủ các trang List, Detail, Create, Edit.

**File:** `frontend/src/app/routes/modules/customers.routes.ts`

```typescript
import { z } from 'zod';
import { createModuleRoutes, baseSearchSchema, type CrudModuleDefinition } from '../type/types';
import { generateCRUDRoutes } from '../utils/routeHelpers';
import { CustomerListPage } from '../../../features/customers/pages/CustomerListPage';
import { CustomerDetailPage } from '../../../features/customers/pages/CustomerDetailPage';
import { CustomerCreatePage } from '../../../features/customers/pages/CustomerCreatePage';
import { CustomerEditPage } from '../../../features/customers/pages/CustomerEditPage';

// 1. Định nghĩa Types và API
// --------------------------
interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'blocked';
}

interface CustomerListData {
  customers: Customer[];
  total: number;
}

const customerSearchSchema = baseSearchSchema.extend({
  status: z.enum(['active', 'inactive', 'blocked']).optional(),
});

export type CustomerListSearch = z.infer<typeof customerSearchSchema>;
export type CustomerDetailParams = { id: string };

async function fetchCustomers(search: CustomerListSearch): Promise<CustomerListData> {
  console.log('Fetching customers with:', search);
  return { customers: [{ id: 'cust_1', fullName: 'Nguyễn Văn A', email: 'a@example.com', phone: '0909123456', status: 'active' }], total: 1 };
}

async function fetchCustomerById(id: string): Promise<Customer> {
  console.log('Fetching customer with id:', id);
  return { id, fullName: 'Nguyễn Văn A', email: 'a@example.com', phone: '0909123456', status: 'active' };
}

// 2. Tạo "Bản thiết kế" cho module CRUD
// ----------------------------------------
const customerModuleDefinition: CrudModuleDefinition<
  CustomerListData,      // Kiểu loader cho List
  Customer,              // Kiểu loader cho Detail
  CustomerListSearch,    // Kiểu search cho List
  CustomerDetailParams,  // Kiểu params cho Detail
  { apiClient: any }      // Kiểu router context
> = {
  entityName: 'Khách hàng',
  basePath: '/customers',
  components: {
    list: CustomerListPage,
    detail: CustomerDetailPage,
    create: CustomerCreatePage,
    edit: CustomerEditPage,
  },
  loaders: {
    list: ({ search }) => fetchCustomers(search),
    detail: ({ params }) => fetchCustomerById(params.id),
  },
  searchSchemas: {
    list: customerSearchSchema,
  },
};

// 3. Tạo Module Routes từ "Bản thiết kế"
// ----------------------------------------
export const customersRoutes = createModuleRoutes(
  'customers',
  '/customers',
  generateCRUDRoutes(customerModuleDefinition)
);
```

---

## 4. Lợi ích trong Component

Cách truy cập dữ liệu trong component không thay đổi và vẫn được hưởng lợi từ type-safety.

```tsx
// Giả sử bạn đã tạo Route object từ config:
// export const CustomerListRoute = createFileRoute('/customers')({ ...config });

import { CustomerListRoute } from './path-to-your-route-file';

function CustomerListComponent() {
  // ✅ `data` có kiểu `CustomerListData`
  const data = CustomerListRoute.useLoaderData();

  // ✅ `searchParams` có kiểu `CustomerListSearch`
  const searchParams = CustomerListRoute.useSearch();

  return (
    <div>
      <h1>Khách hàng ({data.total} kết quả)</h1>
      <p>Trạng thái: {searchParams.status || 'Tất cả'}</p>
      {/* ... */}
    </div>
  );
}
```

---

## 5. Các phương pháp tốt nhất (Best Practices)

1.  **Tập trung vào "Bản thiết kế":** Đây là nơi duy nhất bạn cần chỉnh sửa khi thêm hoặc thay đổi logic cho một module. Mọi thứ khác đã được tự động hóa.
2.  **Tận dụng `searchSchema`:** Luôn định nghĩa schema chi tiết cho việc tìm kiếm để tận dụng khả năng validate tự động của TanStack Router.
3.  **Sử dụng `TRouterContext`:** Để "tiêm" các dependency dùng chung như `queryClient` hoặc `apiClient` vào `loader` một cách an toàn.
