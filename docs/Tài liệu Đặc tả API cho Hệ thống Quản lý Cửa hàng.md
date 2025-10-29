# Tài liệu Đặc tả API cho Hệ thống Quản lý Cửa hàng

## Mục lục

1. [Tổng quan](#1-tổng-quan)
   1.1. [Mục đích](#11-mục-đích)
   1.2. [URL cơ sở (Base URL)](#12-url-cơ-sở-base-url)
   1.3. [Xác thực (Authentication)](#13-xác-thực-authentication)
2. [Quy ước chung (General Conventions)](#2-quy-ước-chung-general-conventions)
   2.1. [Định dạng dữ liệu](#21-định-dạng-dữ-liệu)
   2.2. [Quy ước đặt tên](#22-quy-ước-đặt-tên)
   2.3. [Định dạng ngày giờ](#23-định-dạng-ngày-giờ)
   2.4. [Cấu trúc phản hồi lỗi (Error Response Structure)](#24-cấu-trúc-phản-hồi-lỗi-error-response-structure)
3. [Các Điểm cuối (Endpoints)](#3-các-điểm-cuối-endpoints)
   3.1. [Xác thực và Người dùng (Authentication & Users)](#31-xác-thực-và-người-dùng-authentication--users)
      3.1.1. [Đăng nhập người dùng (User Login)](#311-đăng-nhập-người-dùng-user-login)
      3.1.2. [Lấy danh sách người dùng (Admin)](#312-lấy-danh-sách-người-dùng-admin)
      3.1.3. [Tạo người dùng mới (Admin)](#313-tạo-người-dùng-mới-admin)
      3.1.4. [Cập nhật thông tin người dùng (Admin)](#314-cập-nhật-thông-tin-người-dùng-admin)
      3.1.5. [Xóa người dùng (Admin)](#315-xóa-người-dùng-admin)
   3.2. [Sản phẩm (Products)](#32-sản-phẩm-products)
      3.2.1. [Lấy danh sách sản phẩm](#321-lấy-danh-sách-sản-phẩm)
      3.2.2. [Lấy thông tin sản phẩm theo ID](#322-lấy-thông-tin-sản-phẩm-theo-id)
      3.2.3. [Tạo sản phẩm mới (Admin)](#323-tạo-sản-phẩm-mới-admin)
      3.2.4. [Cập nhật thông tin sản phẩm (Admin)](#324-cập-nhật-thông-tin-sản-phẩm-admin)
      3.2.5. [Xóa sản phẩm (Admin)](#325-xóa-sản-phẩm-admin)
   3.3. [Danh mục sản phẩm (Categories)](#33-danh-mục-sản-phẩm-categories)
      3.3.1. [Lấy danh sách danh mục](#331-lấy-danh-sách-danh-mục)
      3.3.2. [Tạo danh mục mới (Admin)](#332-tạo-danh-mục-mới-admin)
      3.3.3. [Cập nhật danh mục (Admin)](#333-cập-nhật-danh-mục-admin)
      3.3.4. [Xóa danh mục (Admin)](#334-xóa-danh-mục-admin)
   3.4. [Nhà cung cấp (Suppliers)](#34-nhà-cung-cấp-suppliers)
      3.4.1. [Lấy danh sách nhà cung cấp](#341-lấy-danh-sách-nhà-cung-cấp)
      3.4.2. [Tạo nhà cung cấp mới (Admin)](#342-tạo-nhà-cung-cấp-mới-admin)
      3.4.3. [Cập nhật nhà cung cấp (Admin)](#343-cập-nhật-nhà-cung-cấp-admin)
      3.4.4. [Xóa nhà cung cấp (Admin)](#344-xóa-nhà-cung-cấp-admin)
   3.5. [Khách hàng (Customers)](#35-khách-hàng-customers)
      3.5.1. [Lấy danh sách khách hàng](#351-lấy-danh-sách-khách-hàng)
      3.5.2. [Tạo khách hàng mới](#352-tạo-khách-hàng-mới)
      3.5.3. [Cập nhật thông tin khách hàng](#353-cập-nhật-thông-tin-khách-hàng)
   3.6. [Đơn hàng (Orders)](#36-đơn-hàng-orders)
      3.6.1. [Lấy danh sách đơn hàng](#361-lấy-danh-sách-đơn-hàng)
      3.6.2. [Lấy chi tiết đơn hàng theo ID](#362-lấy-chi-tiết-đơn-hàng-theo-id)
      3.6.3. [Tạo đơn hàng mới (Staff)](#363-tạo-đơn-hàng-mới-staff)
      3.6.4. [Cập nhật trạng thái đơn hàng (Staff)](#364-cập-nhật-trạng-thái-đơn-hàng-staff)
      3.6.5. [Xuất hóa đơn PDF (Staff)](#365-xuất-hóa-đơn-pdf-staff)
   3.7. [Chi tiết đơn hàng (Order Items)](#37-chi-tiết-đơn-hàng-order-items)
      3.7.1. [Thêm sản phẩm vào đơn hàng (Staff)](#371-thêm-sản-phẩm-vào-đơn-hàng-staff)
      3.7.2. [Cập nhật số lượng sản phẩm trong chi tiết đơn hàng (Staff)](#372-cập-nhật-số-lượng-sản-phẩm-trong-chi-tiết-đơn-hàng-staff)
      3.7.3. [Xóa sản phẩm khỏi chi tiết đơn hàng (Staff)](#373-xóa-sản-phẩm-khỏi-chi-tiết-đơn-hàng-staff)
   3.8. [Khuyến mãi (Promotions)](#38-khuyến-mãi-promotions)
      3.8.1. [Lấy danh sách khuyến mãi](#381-lấy-danh-sách-khuyến-mãi)
      3.8.2. [Tạo khuyến mãi mới (Admin)](#382-tạo-khuyến-mãi-mới-admin)
      3.8.3. [Cập nhật khuyến mãi (Admin)](#383-cập-nhật-khuyến-mãi-admin)
      3.8.4. [Xóa khuyến mãi (Admin)](#384-xóa-khuyến-mãi-admin)
   3.9. [Tồn kho (Inventory)](#39-tồn-kho-inventory)
      3.9.1. [Lấy thông tin tồn kho](#391-lấy-thông-tin-tồn-kho)
      3.9.2. [Cập nhật số lượng tồn kho (Staff/Admin)](#392-cập-nhật-số-lượng-tồn-kho-staffadmin)
   3.10. [Báo cáo và Thống kê (Admin)](#310-báo-cáo-và-thống-kê-admin)
      3.10.1. [Lấy báo cáo doanh thu](#3101-lấy-báo-cáo-doanh-thu)
4. [Tham khảo (References)](#4-tham-khảo-references)

---

# Tài liệu Đặc tả API cho Hệ thống Quản lý Cửa hàng

## 1. Tổng quan

### 1.1. Mục đích

Tài liệu này cung cấp đặc tả chi tiết cho các API của hệ thống quản lý cửa hàng, nhằm hỗ trợ đội ngũ phát triển backend và frontend trong việc xây dựng và tích hợp các thành phần của hệ thống. API này sẽ cho phép quản lý sản phẩm, tồn kho, đơn hàng, khách hàng, nhà cung cấp, danh mục và các chương trình khuyến mãi, cũng như hỗ trợ xác thực người dùng và báo cáo thống kê [1].

### 1.2. URL cơ sở (Base URL)

Các URL cơ sở cho các môi trường khác nhau được định nghĩa như sau:

*   **Môi trường phát triển (Development):** `http://localhost:3000/api/v1`

### 1.3. Xác thực (Authentication)

Hệ thống sử dụng xác thực dựa trên **JSON Web Token (JWT)**. Người dùng (Admin hoặc Staff) sẽ đăng nhập để nhận được một JWT. Token này sau đó phải được gửi trong mỗi yêu cầu API tiếp theo thông qua tiêu đề `Authorization` với định dạng `Bearer <token>`. Quyền truy cập vào các tài nguyên cụ thể sẽ được kiểm soát dựa trên vai trò (`role`) của người dùng được mã hóa trong JWT [1].

**Ví dụ:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. Quy ước chung (General Conventions)

### 2.1. Định dạng dữ liệu

Tất cả các yêu cầu và phản hồi API sẽ sử dụng định dạng **JSON** (`application/json`).

### 2.2. Quy ước đặt tên

*   Các trường trong đối tượng JSON sẽ sử dụng quy ước `camelCase` (ví dụ: `productId`, `productName`, `createdAt`).
*   Tên tài nguyên trong URL sẽ sử dụng `kebab-case` (ví dụ: `/api/v1/admin/products`).

### 2.3. Định dạng ngày giờ

Tất cả các trường ngày giờ sẽ tuân thủ định dạng **ISO 8601** (ví dụ: `2025-10-26T10:00:00Z`).

### 2.4. Cấu trúc Phản hồi Chung (General Response Structure)

Tất cả các phản hồi từ API đều tuân theo một cấu trúc chung `ApiResponse<T>` để đảm bảo tính nhất quán.

**Cấu trúc `ApiResponse<T>`:**

```json
{
  "isError": false,
  "message": "Thành công",
  "data": { ... }, // Dữ liệu trả về, kiểu T
  "timestamp": "2025-10-26T10:00:00Z"
}
```

**Các trường:**

| Tên trường | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `isError` | `boolean` | `true` nếu có lỗi, ngược lại là `false`. |
| `message` | `string` | Thông điệp mô tả kết quả (thành công hoặc lỗi). |
| `data` | `T` | Dữ liệu chính của phản hồi. Có thể là `null` nếu có lỗi. |
| `timestamp` | `DateTime` | Thời gian phản hồi được tạo (định dạng ISO 8601). |

**Xử lý thành công:**

*   `isError` sẽ là `false`.
*   `message` thường là "Success" hoặc một thông báo thành công cụ thể.
*   `data` chứa dữ liệu phản hồi.

**Xử lý lỗi (Exception):**

*   Đối với các lỗi máy chủ không xác định (unhandled exceptions), hệ thống sẽ trả về mã trạng thái HTTP `500`.
*   Trong trường hợp này, `ApiResponse` sẽ có:
    *   `isError`: `true`
    *   `message`: Nội dung chi tiết của lỗi từ exception (ví dụ: `exception.Message`).
    *   `data`: `null`
    
    **StatusCode** sẽ được set trong ObjectResult và ObjectResult sẽ đặt vào trong mã trạng thái HTTP 
*   Các lỗi cụ thể khác (ví dụ: validation, not found) có thể được xử lý ở tầng controller và trả về các mã trạng thái HTTP 4xx tương ứng cùng với cấu trúc `ApiResponse` phù hợp.

**Ví dụ Phản hồi Lỗi (HTTP 500):**

**1. Dòng trạng thái HTTP (HTTP Status Line)**

Đây là phần đầu tiên của phản hồi mà client nhận được.
```
HTTP/1.1 500 Internal Server Error
```
*   Ở đây, `500` chính là `StatusCode`.

**2. Nội dung phản hồi (HTTP Body)**

Đây là phần chứa dữ liệu JSON mà lớp `ApiResponse` của bạn tạo ra.
```json
{
  "isError": true,
  "message": "An unexpected error occurred. Object reference not set to an instance of an object.",
  "data": null,
  "timestamp": "2025-10-26T12:30:00Z"
}
```

### 2.5. Phân trang (Pagination)

Các endpoint lấy danh sách (`GET` collection) hỗ trợ phân trang qua các query parameters.

**Request:** `PagedRequest`

| Tên trường | Kiểu dữ liệu | Mặc định | Mô tả |
|---|---|---|---|
| `page` | `int` | `1` | Số trang hiện tại. |
| `pageSize` | `int` | `20` | Số lượng mục trên mỗi trang. |
| `search` | `string` | `null` | Từ khóa tìm kiếm. |
| `sortBy` | `string` | `Id` | Tên trường để sắp xếp. |
| `sortDesc` | `boolean` | `true` | Sắp xếp giảm dần (`true`) hoặc tăng dần (`false`). |

**Response:** `PagedList<T>`

Khi phân trang, trường `data` trong `ApiResponse` sẽ có cấu trúc `PagedList<T>`:

```json
{
  "page": 1,
  "pageSize": 20,
  "totalCount": 100,
  "totalPages": 5,
  "hasPrevious": false,
  "hasNext": true,
  "items": [ ... ] // Mảng các đối tượng
}
```

### 2.6. Cấu trúc Request Body

#### Tạo mới (POST)

Request body chứa đối tượng JSON đại diện cho `Entity` cần tạo, bỏ qua các trường do hệ thống quản lý (`id`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`).

#### Cập nhật (PUT)

Request body chứa **toàn bộ** đối tượng `Entity`, bao gồm cả `id` và các giá trị đã sửa đổi. `id` của tài nguyên cũng phải được chỉ định trong URL.

## 3. Các Điểm cuối (Endpoints)

Phần này mô tả chi tiết các điểm cuối API dựa trên các yêu cầu chức năng và mô hình ERD [1], [2].

### 3.1. Xác thực và Người dùng (Authentication & Users)

#### 3.1.1. Đăng nhập người dùng (User Login)

*   **Chức năng:** Cho phép người dùng (Admin/Staff) đăng nhập và nhận JWT.
*   **HTTP Method:** `POST`
*   **URL:** `/auth/login`
*   **Permissions:** `AllowAnonymous`
*   **Request Body:** `LoginRequest`

    ```json
    {
      "username": "string", // Tên đăng nhập, bắt buộc
      "password": "string"  // Mật khẩu, bắt buộc
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<LoginResponse>`

    ```json
    {
      "isError": false,
      "message": "Đăng nhập thành công.",
      "data": {
        "token": "string",
        "user": {
          "id": "integer",
          "username": "string",
          "fullName": "string",
          "role": "integer" // 0: Admin, 1: Staff
        }
      },
      "timestamp": "datetime"
    }
    ```

*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`

#### 3.1.2. Lấy danh sách người dùng (Admin)

*   **Chức năng:** Lấy danh sách tất cả người dùng, có phân trang và tìm kiếm. Chỉ Admin mới có quyền.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/users`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest` (Xem [mục Phân trang](#25-phân-trang-pagination))
*   **Success Response (200 OK):** `ApiResponse<PagedList<UserEntity>>`

    *Phần `data` của response sẽ là một đối tượng `PagedList<UserEntity>`.*

*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`

#### 3.1.3. Lấy người dùng theo ID (Admin)

*   **Chức năng:** Lấy thông tin chi tiết của một người dùng dựa vào ID. Chỉ Admin mới có quyền.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/users/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của người dùng)
*   **Success Response (200 OK):** `ApiResponse<UserEntity>`

*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.1.4. Tạo người dùng mới (Admin)

*   **Chức năng:** Admin tạo một tài khoản người dùng mới.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/users`
*   **Permissions:** `Authorize`
*   **Request Body:** `UserEntity` (chỉ các trường cần thiết)

    ```json
    {
      "username": "string", // Tên đăng nhập duy nhất, bắt buộc
      "password": "string", // Mật khẩu, bắt buộc
      "fullName": "string", // Họ và tên, bắt buộc
      "role": 1 // 0: Admin, 1: Staff. Bắt buộc
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<UserEntity>`

*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`

#### 3.1.5. Cập nhật thông tin người dùng (Admin)

*   **Chức năng:** Admin cập nhật thông tin của một người dùng hiện có.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/users/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của người dùng cần cập nhật)
*   **Request Body:** Toàn bộ `UserEntity`

    ```json
    {
      "id": "integer",
      "username": "string",
      "password": "string", // Gửi chuỗi rỗng nếu không muốn đổi mật khẩu
      "fullName": "string",
      "role": 1, // 0: Admin, 1: Staff
      "createdAt": "datetime"
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<UserEntity>`

*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.1.6. Xóa người dùng (Admin)

*   **Chức năng:** Admin xóa một người dùng khỏi hệ thống (soft delete).
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/users/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của người dùng cần xóa)
*   **Success Response (200 OK):** `ApiResponse<boolean>`

    ```json
    {
        "isError": false,
        "message": "Xóa thành công.",
        "data": true,
        "timestamp": "datetime"
    }
    ```

*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### 3.2. Sản phẩm (Products)

*Controller này kế thừa từ `BaseAdminController` và yêu cầu quyền `Admin`.*

#### 3.2.1. Lấy danh sách sản phẩm

*   **Chức năng:** Lấy danh sách tất cả sản phẩm, có thể lọc và phân trang.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/products`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest` (Lọc theo `categoryId`, `supplierId` có thể được hỗ trợ dưới dạng query mở rộng).
*   **Success Response (200 OK):** `ApiResponse<PagedList<ProductEntity>>`

#### 3.2.2. Lấy thông tin sản phẩm theo ID

*   **Chức năng:** Lấy thông tin chi tiết của một sản phẩm dựa trên ID.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/products/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của sản phẩm)
*   **Success Response (200 OK):** `ApiResponse<ProductEntity>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.2.3. Tạo sản phẩm mới (Admin)

*   **Chức năng:** Admin thêm một sản phẩm mới vào hệ thống.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/products`
*   **Permissions:** `Authorize`
*   **Request Body:** `ProductEntity` (chỉ các trường cần thiết)

    ```json
    {
      "categoryId": "integer",
      "supplierId": "integer",
      "productName": "string",
      "barcode": "string",
      "price": "number",
      "unit": "string"
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<ProductEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`

#### 3.2.4. Cập nhật thông tin sản phẩm (Admin)

*   **Chức năng:** Admin cập nhật thông tin của một sản phẩm hiện có.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/products/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của sản phẩm cần cập nhật)
*   **Request Body:** Toàn bộ `ProductEntity`

    ```json
    {
      "id": "integer",
      "categoryId": "integer",
      "supplierId": "integer",
      "productName": "string",
      "barcode": "string",
      "price": "number",
      "unit": "string",
      "createdAt": "datetime"
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<ProductEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`

#### 3.2.5. Xóa sản phẩm (Admin)

*   **Chức năng:** Admin xóa một sản phẩm khỏi hệ thống (soft delete).
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/products/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của sản phẩm cần xóa)
*   **Success Response (200 OK):** `ApiResponse<boolean>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### 3.3. Danh mục sản phẩm (Categories)

*Controller này kế thừa từ `BaseAdminController` và yêu cầu quyền `Admin`.*

#### 3.3.1. Lấy danh sách danh mục

*   **Chức năng:** Lấy danh sách tất cả các danh mục sản phẩm.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/categories`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest`
*   **Success Response (200 OK):** `ApiResponse<PagedList<CategoryEntity>>`

#### 3.3.2. Lấy danh mục theo ID

*   **Chức năng:** Lấy thông tin chi tiết của một danh mục.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/categories/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của danh mục)
*   **Success Response (200 OK):** `ApiResponse<CategoryEntity>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.3.3. Tạo danh mục mới (Admin)

*   **Chức năng:** Admin tạo một danh mục sản phẩm mới.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/categories`
*   **Permissions:** `Authorize`
*   **Request Body:** `CategoryEntity` (chỉ các trường cần thiết)

    ```json
    {
      "categoryName": "string" // Tên danh mục, bắt buộc
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<CategoryEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`

#### 3.3.4. Cập nhật danh mục (Admin)

*   **Chức năng:** Admin cập nhật tên của một danh mục sản phẩm.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/categories/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của danh mục cần cập nhật)
*   **Request Body:** Toàn bộ `CategoryEntity`

    ```json
    {
      "id": "integer",
      "categoryName": "string"
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<CategoryEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`

#### 3.3.5. Xóa danh mục (Admin)

*   **Chức năng:** Admin xóa một danh mục sản phẩm (soft delete).
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/categories/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của danh mục cần xóa)
*   **Success Response (200 OK):** `ApiResponse<boolean>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (CATEGORY_HAS_PRODUCTS)

### 3.4. Nhà cung cấp (Suppliers)

*Controller này kế thừa từ `BaseAdminController` và yêu cầu quyền `Admin`.*

#### 3.4.1. Lấy danh sách nhà cung cấp

*   **Chức năng:** Lấy danh sách tất cả các nhà cung cấp.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/suppliers`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest`
*   **Success Response (200 OK):** `ApiResponse<PagedList<SupplierEntity>>`

#### 3.4.2. Lấy nhà cung cấp theo ID

*   **Chức năng:** Lấy thông tin chi tiết của một nhà cung cấp.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/suppliers/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của nhà cung cấp)
*   **Success Response (200 OK):** `ApiResponse<SupplierEntity>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.4.3. Tạo nhà cung cấp mới (Admin)

*   **Chức năng:** Admin tạo một nhà cung cấp mới.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/suppliers`
*   **Permissions:** `Authorize`
*   **Request Body:** `SupplierEntity` (chỉ các trường cần thiết)

    ```json
    {
      "name": "string",
      "phone": "string",
      "email": "string",
      "address": "string"
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<SupplierEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`

#### 3.4.4. Cập nhật nhà cung cấp (Admin)

*   **Chức năng:** Admin cập nhật thông tin của một nhà cung cấp.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/suppliers/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của nhà cung cấp cần cập nhật)
*   **Request Body:** Toàn bộ `SupplierEntity`

    ```json
    {
      "id": "integer",
      "name": "string",
      "phone": "string",
      "email": "string",
      "address": "string"
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<SupplierEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.4.5. Xóa nhà cung cấp (Admin)

*   **Chức năng:** Admin xóa một nhà cung cấp (soft delete).
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/suppliers/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của nhà cung cấp cần xóa)
*   **Success Response (200 OK):** `ApiResponse<boolean>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (SUPPLIER_HAS_PRODUCTS)

### 3.5. Khách hàng (Customers)

*Controller này kế thừa từ `BaseAdminController` và yêu cầu quyền `Admin` hoặc `Staff`.*

#### 3.5.1. Lấy danh sách khách hàng

*   **Chức năng:** Lấy danh sách tất cả khách hàng.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/customers`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest`
*   **Success Response (200 OK):** `ApiResponse<PagedList<CustomerEntity>>`

#### 3.5.2. Lấy khách hàng theo ID

*   **Chức năng:** Lấy thông tin chi tiết của một khách hàng.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/customers/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của khách hàng)
*   **Success Response (200 OK):** `ApiResponse<CustomerEntity>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.5.3. Tạo khách hàng mới

*   **Chức năng:** Tạo một khách hàng mới.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/customers`
*   **Permissions:** `Authorize`
*   **Request Body:** `CustomerEntity` (chỉ các trường cần thiết)

    ```json
    {
      "name": "string",
      "phone": "string",
      "email": "string",
      "address": "string"
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<CustomerEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`

#### 3.5.4. Cập nhật thông tin khách hàng

*   **Chức năng:** Cập nhật thông tin của một khách hàng.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/customers/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của khách hàng cần cập nhật)
*   **Request Body:** Toàn bộ `CustomerEntity`

    ```json
    {
      "id": "integer",
      "name": "string",
      "phone": "string",
      "email": "string",
      "address": "string"
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<CustomerEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`

#### 3.5.5. Xóa khách hàng

*   **Chức năng:** Xóa một khách hàng (soft delete).
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/customers/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của khách hàng cần xóa)
*   **Success Response (200 OK):** `ApiResponse<boolean>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### 3.6. Đơn hàng (Orders)

*Các endpoints này yêu cầu quyền `Admin` hoặc `Staff`.*

#### 3.6.1. Lấy danh sách đơn hàng

*   **Chức năng:** Lấy danh sách tất cả đơn hàng, có thể lọc và phân trang.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/orders`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest` (hỗ trợ lọc theo `status`, `customerId`, `userId`, `startDate`, `endDate`).
*   **Success Response (200 OK):** `ApiResponse<PagedList<OrderEntity>>`

#### 3.6.2. Lấy chi tiết đơn hàng theo ID

*   **Chức năng:** Lấy thông tin chi tiết của một đơn hàng, bao gồm danh sách các sản phẩm.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/orders/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của đơn hàng)
*   **Success Response (200 OK):** `ApiResponse<OrderDetailsDto>`

    ```json
    {
        "id": "integer",
        "customerId": "integer",
        "customerName": "string",
        // ... các trường khác của đơn hàng
        "orderItems": [
            {
                "orderItemId": "integer",
                "productId": "integer",
                "productName": "string",
                "quantity": "integer",
                "price": "number",
                "subtotal": "number"
            }
        ]
    }
    ```

*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.6.3. Tạo đơn hàng mới (Staff)

*   **Chức năng:** Nhân viên tạo một đơn hàng mới.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/orders`
*   **Permissions:** `Authorize`
*   **Request Body:**

    ```json
    {
      "customerId": "integer",
      "promoCode": "string", // Không bắt buộc
      "orderItems": [
        {
          "productId": "integer",
          "quantity": "integer"
        }
      ]
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<OrderDetailsDto>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.6.4. Cập nhật trạng thái đơn hàng (Staff)

*   **Chức năng:** Nhân viên cập nhật trạng thái của một đơn hàng.
*   **HTTP Method:** `PATCH`
*   **URL:** `/admin/orders/{id}/status`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của đơn hàng)
*   **Request Body:**

    ```json
    {
      "status": "string" // Trạng thái mới: 'paid' hoặc 'canceled'
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<OrderEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.6.5. Xuất hóa đơn PDF (Staff)

*   **Chức năng:** Xuất hóa đơn PDF cho đơn hàng đã thanh toán.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/orders/{id}/invoice`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của đơn hàng)
*   **Success Response (200 OK):** Trả về file PDF với `Content-Type: application/pdf`.
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `400 Bad Request` (ORDER_NOT_PAID)

### 3.7. Chi tiết đơn hàng (Order Items)

*Các thao tác này yêu cầu quyền `Admin` hoặc `Staff` và chỉ được phép khi đơn hàng ở trạng thái `pending`.*

#### 3.7.1. Thêm sản phẩm vào đơn hàng (Staff)

*   **Chức năng:** Thêm một sản phẩm vào một đơn hàng đang `pending`.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/orders/{orderId}/items`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `orderId`: `integer` (ID của đơn hàng)
*   **Request Body:**

    ```json
    {
      "productId": "integer",
      "quantity": "integer"
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<OrderItemEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.7.2. Cập nhật số lượng sản phẩm trong chi tiết đơn hàng (Staff)

*   **Chức năng:** Cập nhật số lượng của một sản phẩm trong một đơn hàng `pending`.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/orders/{orderId}/items/{itemId}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `orderId`: `integer` (ID của đơn hàng)
    *   `itemId`: `integer` (ID của chi tiết đơn hàng)
*   **Request Body:**

    ```json
    {
      "quantity": "integer" // Số lượng mới
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<OrderItemEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.7.3. Xóa sản phẩm khỏi chi tiết đơn hàng (Staff)

*   **Chức năng:** Xóa một sản phẩm khỏi một đơn hàng `pending`.
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/orders/{orderId}/items/{itemId}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `orderId`: `integer` (ID của đơn hàng)
    *   `itemId`: `integer` (ID của chi tiết đơn hàng)
*   **Success Response (200 OK):** `ApiResponse<boolean>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### 3.8. Khuyến mãi (Promotions)

*Controller này kế thừa từ `BaseAdminController` và yêu cầu quyền `Admin`.*

#### 3.8.1. Lấy danh sách khuyến mãi

*   **Chức năng:** Lấy danh sách tất cả các chương trình khuyến mãi.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/promotions`
*   **Permissions:** `Authorize`
*   **Query Parameters:** `PagedRequest` (hỗ trợ lọc theo `status`).
*   **Success Response (200 OK):** `ApiResponse<PagedList<PromotionEntity>>`

#### 3.8.2. Lấy khuyến mãi theo ID

*   **Chức năng:** Lấy thông tin chi tiết của một chương trình khuyến mãi.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/promotions/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của khuyến mãi)
*   **Success Response (200 OK):** `ApiResponse<PromotionEntity>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.8.3. Tạo khuyến mãi mới (Admin)

*   **Chức năng:** Admin tạo một chương trình khuyến mãi mới.
*   **HTTP Method:** `POST`
*   **URL:** `/admin/promotions`
*   **Permissions:** `Authorize`
*   **Request Body:** `PromotionEntity` (chỉ các trường cần thiết)

    ```json
    {
      "promoCode": "string",
      "description": "string",
      "discountType": "string", // 'percent' hoặc 'fixed'
      "discountValue": "number",
      "startDate": "date",
      "endDate": "date",
      "minOrderAmount": "number",
      "usageLimit": "integer",
      "status": "string" // 'active' hoặc 'inactive'
    }
    ```

*   **Success Response (201 Created):** `ApiResponse<PromotionEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`

#### 3.8.4. Cập nhật khuyến mãi (Admin)

*   **Chức năng:** Admin cập nhật thông tin của một chương trình khuyến mãi.
*   **HTTP Method:** `PUT`
*   **URL:** `/admin/promotions/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của khuyến mãi cần cập nhật)
*   **Request Body:** Toàn bộ `PromotionEntity`
*   **Success Response (200 OK):** `ApiResponse<PromotionEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`

#### 3.8.5. Xóa khuyến mãi (Admin)

*   **Chức năng:** Admin xóa một chương trình khuyến mãi (soft delete).
*   **HTTP Method:** `DELETE`
*   **URL:** `/admin/promotions/{id}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `id`: `integer` (ID của khuyến mãi cần xóa)
*   **Success Response (200 OK):** `ApiResponse<boolean>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (PROMO_IN_USE)

### 3.9. Tồn kho (Inventory)

*Các endpoints này yêu cầu quyền `Admin` hoặc `Staff`.*

#### 3.9.1. Lấy thông tin tồn kho

*   **Chức năng:** Lấy thông tin tồn kho của một sản phẩm cụ thể.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/inventory/{productId}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `productId`: `integer` (ID của sản phẩm)
*   **Success Response (200 OK):** `ApiResponse<InventoryEntity>`
*   **Error Responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

#### 3.9.2. Cập nhật số lượng tồn kho (Staff/Admin)

*   **Chức năng:** Cập nhật số lượng tồn kho của một sản phẩm.
*   **HTTP Method:** `PATCH`
*   **URL:** `/admin/inventory/{productId}`
*   **Permissions:** `Authorize`
*   **Path Parameters:**
    *   `productId`: `integer` (ID của sản phẩm)
*   **Request Body:**

    ```json
    {
      "quantityChange": "integer", // Số lượng thay đổi (dương để tăng, âm để giảm)
      "reason": "string"           // Lý do cập nhật (ví dụ: 'nhập hàng', 'kiểm kê')
    }
    ```

*   **Success Response (200 OK):** `ApiResponse<InventoryEntity>`
*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

### 3.10. Báo cáo và Thống kê (Admin)

*Các endpoints này yêu cầu quyền `Admin`.*

#### 3.10.1. Lấy báo cáo doanh thu

*   **Chức năng:** Admin lấy báo cáo doanh thu theo khoảng thời gian.
*   **HTTP Method:** `GET`
*   **URL:** `/admin/reports/revenue`
*   **Permissions:** `Authorize`
*   **Query Parameters:**
    *   `startDate`: `date` (YYYY-MM-DD, bắt buộc)
    *   `endDate`: `date` (YYYY-MM-DD, bắt buộc)
    *   `groupBy`: `string` (Tùy chọn: `day`, `week`, `month`. Mặc định: `day`)
*   **Success Response (200 OK):** `ApiResponse<RevenueReportDto>`

    ```json
    {
        "isError": false,
        "message": "Thành công",
        "data": {
            "summary": {
                "overallRevenue": "number",
                "overallOrders": "integer",
                "overallDiscount": "number"
            },
            "details": [
                {
                    "period": "string", // '2025-10-26', '2025-W43', '2025-10'
                    "totalRevenue": "number",
                    "totalOrders": "integer",
                    "totalDiscount": "number"
                }
            ]
        },
        "timestamp": "datetime"
    }
    ```

*   **Error Responses:** `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

## 4. Tham khảo (References)

1.  [SRS_StoreManagement.md](/home/ubuntu/upload/SRS_StoreManagement.md)
2.  [PhanTichERD_StoreManagement.md](/home/ubuntu/upload/PhanTichERD_StoreManagement.md)
3.  [API-Spectification-Structure-Guide.md](/home/ubuntu/upload/API-Spectification-Structure-Guide.md)

