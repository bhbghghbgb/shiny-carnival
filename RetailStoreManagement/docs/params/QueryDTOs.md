# Phân Tích Cấu Trúc DTO Truy Vấn (Query/Search)

Tài liệu này phân tích chi tiết cấu trúc các Data Transfer Objects (DTOs) được sử dụng để gửi tham số truy vấn, tìm kiếm, và phân trang đến API.

## 1. Thiết kế chung: Kế thừa và Tái sử dụng

Cấu trúc DTO được thiết kế theo hướng kế thừa để tối đa hóa việc tái sử dụng code và đảm bảo tính nhất quán:

-   **Lớp cơ sở (`PagedRequest`)**: Chứa các thuộc tính chung nhất mà hầu hết các yêu cầu truy vấn danh sách đều cần, bao gồm phân trang, sắp xếp, và tìm kiếm cơ bản.
-   **Lớp chuyên biệt (`ProductSearchRequest`, `OrderSearchRequest`)**: Kế thừa từ `PagedRequest` và bổ sung các thuộc tính lọc (filter) dành riêng cho từng loại đối tượng cụ thể.

## 2. Lớp cơ sở: `PagedRequest.cs`

Đây là DTO nền tảng, được sử dụng cho các endpoint không yêu cầu bộ lọc phức tạp.

-   **Đường dẫn**: `RetailStoreManagement/Common/PagedRequest.cs`
-   **Đối tượng sử dụng**: `UsersController`, `CategoriesController`, `SuppliersController`, `CustomersController`.

### Phân tích thuộc tính

| Thuộc tính | Kiểu dữ liệu | Giá trị mặc định | Mô tả                                                                                             |
| :--------- | :----------- | :---------------- | :------------------------------------------------------------------------------------------------ |
| `Page`       | `int`        | `1`               | Số thứ tự của trang kết quả muốn lấy.                                                              |
| `PageSize`   | `int`        | `20`              | Số lượng mục (item) tối đa trên một trang.                                                        |
| `Search`     | `string?`    | `null`            | Chuỗi văn bản để tìm kiếm chung. Ví dụ: tìm theo `Username` và `FullName` của người dùng.            |
| `SortBy`     | `string`     | `"Id"`          | Tên thuộc tính (cột) dùng để sắp xếp.                                                              |
| `SortDesc`   | `bool`       | `true`            | Chiều sắp xếp. `true` = Giảm dần (DESC), `false` = Tăng dần (ASC).                                  |

### Ví dụ sử dụng với `UsersController`

Endpoint `GET /api/admin/users` nhận trực tiếp `PagedRequest` làm tham số truy vấn:

```csharp
// File: Controllers/Admin/UsersController.cs

[HttpGet]
public async Task<IActionResult> GetUsers([FromQuery] PagedRequest request)
{
    var result = await _userService.GetUsersAsync(request);
    return StatusCode(result.StatusCode, result);
}
```

## 3. Lớp chuyên biệt: `ProductSearchRequest.cs`

DTO này được tạo ra để phục vụ nhu cầu tìm kiếm sản phẩm với nhiều tiêu chí lọc khác nhau.

-   **Đường dẫn**: `RetailStoreManagement/Models/Common/ProductSearchRequest.cs`
-   **Đối tượng sử dụng**: `ProductsController`.

### Cấu trúc và Kế thừa

`ProductSearchRequest` kế thừa từ `PagedRequest`, do đó nó tự động có tất cả 5 thuộc tính chung đã nêu ở trên.

```csharp
public class ProductSearchRequest : PagedRequest
{
    // ... các thuộc tính chuyên biệt
}
```

### Phân tích các thuộc tính bổ sung

Ngoài các thuộc tính kế thừa, DTO này bổ sung các bộ lọc dành riêng cho sản phẩm:

| Thuộc tính   | Kiểu dữ liệu | Mô tả                                                              |
| :----------- | :----------- | :----------------------------------------------------------------- |
| `CategoryId` | `int?`       | Lọc sản phẩm theo một mã loại sản phẩm (category) cụ thể.         |
| `SupplierId` | `int?`       | Lọc sản phẩm theo một mã nhà cung cấp (supplier) cụ thể.          |
| `MinPrice`   | `decimal?`   | Lọc các sản phẩm có giá lớn hơn hoặc bằng giá trị này.             |
| `MaxPrice`   | `decimal?`   | Lọc các sản phẩm có giá nhỏ hơn hoặc bằng giá trị này.             |

**Lưu ý**: Tất cả các thuộc tính này đều là `nullable` (`?`), có nghĩa chúng là các bộ lọc tùy chọn và có thể được bỏ qua khi gửi request.

### Ví dụ sử dụng với `ProductsController`

Endpoint `GET /api/admin/products` nhận `ProductSearchRequest` để cho phép tìm kiếm nâng cao:

```csharp
// File: Controllers/Admin/ProductsController.cs

[HttpGet]
public async Task<IActionResult> GetProducts([FromQuery] ProductSearchRequest request)
{
    var result = await _productService.GetProductsAsync(request);
    return StatusCode(result.StatusCode, result);
}
```

## 4. Tổng kết

Thiết kế này mang lại nhiều lợi ích:

-   **Tái sử dụng code**: Các tham số phân trang và sắp xếp được định nghĩa một lần trong `PagedRequest`.
-   **Dễ mở rộng**: Khi cần thêm bộ lọc cho một đối tượng mới, chỉ cần tạo một class mới kế thừa từ `PagedRequest`.
-   **Tính nhất quán**: Tất cả các API endpoint truy vấn danh sách đều có chung một cấu trúc tham số cơ bản, giúp phía client dễ dàng làm việc.
