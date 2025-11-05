# Kế Hoạch Implementation Cơ Chế Phân Trang

Tài liệu này mô tả kế hoạch chi tiết để implement cơ chế phân trang cho dự án `RetailStoreManagement`, dựa trên việc phân tích codebase hiện tại và tài liệu tham khảo `PAGINATION_MECHANISM.md`.

## 1. Tổng Quan

Mục tiêu là xây dựng một cơ chế phân trang hiệu quả, tái sử dụng được và tích hợp mượt mà vào kiến trúc Service-Repository hiện tại của dự án.

**Hướng tiếp cận:**

- **Tận dụng và Mở rộng**: Thay vì thay đổi toàn bộ kiến trúc sang CQRS/MediatR như trong tài liệu tham khảo, chúng ta sẽ mở rộng các class `PagedList<T>` và `PagedRequest` hiện có.
- **Phân trang tại Database**: Logic phân trang (`Skip` và `Take`) sẽ được thực thi ở tầng cơ sở dữ liệu thông qua `IQueryable` để đảm bảo hiệu năng tối ưu.
- **Tập trung vào Backend**: Kế hoạch này tập trung vào việc implement backend. Frontend sẽ được tích hợp sau khi các API đã hoàn chỉnh.

## 2. Cấu Trúc Dữ Liệu

### a. `Common/PagedRequest.cs`

Lớp `PagedRequest` hiện tại đã đủ dùng cho các yêu cầu cơ bản. Chúng ta sẽ giữ nguyên cấu trúc này.

```csharp
// File: Common/PagedRequest.cs
public class PagedRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Search { get; set; }
    public string SortBy { get; set; } = "Id";
    public bool SortDesc { get; set; } = true;
}
```

### b. `Common/PagedList<T>.cs`

Đây là thay đổi quan trọng nhất. Chúng ta sẽ thêm một phương thức tĩnh `CreateAsync` vào lớp `PagedList<T>` để nó có khả năng tạo ra một danh sách đã phân trang trực tiếp từ một `IQueryable<T>`.

**File cần chỉnh sửa:** `Common/PagedList.cs`

**Code example:**

```csharp
// Thêm vào file Common/PagedList.cs
using Microsoft.EntityFrameworkCore;

// ... namespace và class definition ...

    // ===== PHƯƠNG THỨC MỚI =====
    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int page, int pageSize)
    {
        var count = await source.CountAsync();
        var items = await source.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, page, pageSize);
    }

// ... phần còn lại của file ...
```

**Giải thích:**
- Phương thức `CreateAsync` nhận vào một `IQueryable<T>`, thực hiện `CountAsync`, `Skip`, `Take` và `ToListAsync` để tạo ra kết quả phân trang. Toàn bộ quá trình này được Entity Framework Core dịch thành câu lệnh SQL hiệu quả.

## 3. Backend Implementation

### a. Tầng Repository (`Repositories/Repository.cs`)

Không cần thay đổi gì ở tầng Repository. Phương thức `GetAll()` trả về `IQueryable<T>` đã đủ để chúng ta xây dựng logic phân trang ở tầng Service.

### b. Tầng Service

Chúng ta sẽ áp dụng logic phân trang vào các service cần thiết, ví dụ `ProductService`.

**File cần chỉnh sửa:** `Services/ProductService.cs`

**Code example:**

```csharp
// Thêm một phương thức mới vào IProductService (trong Interfaces/Services/IProductService.cs)
Task<PagedList<ProductDto>> GetProductsAsync(PagedRequest request);

// Implement phương thức trong ProductService.cs
public async Task<PagedList<ProductDto>> GetProductsAsync(PagedRequest request)
{
    var query = _unitOfWork.GetRepository<ProductEntity>().GetAll()
        .Include(p => p.Category)
        .AsQueryable();

    // Áp dụng tìm kiếm (ví dụ)
    if (!string.IsNullOrEmpty(request.Search))
    {
        query = query.Where(p => p.Name.Contains(request.Search));
    }

    // Ánh xạ sang DTO
    var dtoQuery = query.Select(p => new ProductDto
    {
        Id = p.Id,
        Name = p.Name,
        Price = p.Price,
        CategoryName = p.Category.Name
        // ... các thuộc tính khác
    });

    // Gọi phương thức phân trang
    var pagedProducts = await PagedList<ProductDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);
    return pagedProducts;
}
```

### c. Tầng Controller

Controller sẽ được cập nhật để nhận các tham số phân trang từ query string và gọi đến service tương ứng.

**File cần chỉnh sửa:** `Controllers/Staff/ProductController.cs` (ví dụ)

**Code example:**

```csharp
[HttpGet]
public async Task<ActionResult<ApiResponse<PagedList<ProductDto>>>> GetProducts([FromQuery] PagedRequest request)
{
    var products = await _productService.GetProductsAsync(request);
    return Ok(new ApiResponse<PagedList<ProductDto>>(products, "Products retrieved successfully."));
}
```

**Giải thích:**
- Action `GetProducts` sẽ nhận một đối tượng `PagedRequest` từ query string của URL (ví dụ: `/api/Product?page=1&pageSize=10&search=MyProduct`).
- `[FromQuery]` attribute sẽ tự động bind các tham số từ URL vào đối tượng `request`.
- Kết quả trả về là một `ApiResponse` chứa `PagedList<ProductDto>`.

## 4. Danh Sách Files Cần Tạo/Chỉnh Sửa

### Files Cần Chỉnh Sửa:

1. **`Common/PagedList.cs`**
   - Thêm phương thức `CreateAsync` để hỗ trợ phân trang từ `IQueryable`
   - Thêm using `Microsoft.EntityFrameworkCore`

2. **`Interfaces/Services/IProductService.cs`**
   - Thêm method signature: `Task<PagedList<ProductDto>> GetProductsAsync(PagedRequest request)`

3. **`Services/ProductService.cs`**
   - Implement method `GetProductsAsync` với logic phân trang

4. **`Controllers/Staff/ProductController.cs`** (nếu chưa có)
   - Tạo action `GetProducts` để handle pagination request

5. **Các Service khác** (tùy chọn):
   - `CustomerService.cs`, `CategoryService.cs`, `OrderService.cs`...
   - Implement pagination cho từng entity cần thiết

### Files Cần Tạo Mới:

1. **`Models/Product/ProductDto.cs`** (nếu chưa có)
   - DTO class để transfer dữ liệu Product

2. **Test Files:**
   - `Tests/Unit/Common/PagedListTests.cs`
   - `Tests/Unit/Services/ProductServiceTests.cs`
   - `Tests/Integration/Controllers/ProductControllerTests.cs`

## 5. Chi Tiết Implementation Từng Bước

### Bước 1: Nâng cấp PagedList<T>

**File:** `Common/PagedList.cs`

```csharp
using Microsoft.EntityFrameworkCore;

namespace RetailStoreManagement.Common;

public class PagedList<T> : IPagedList<T>
{
    // ... existing properties ...

    // PHƯƠNG THỨC MỚI
    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int page, int pageSize)
    {
        // Validation
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;
        if (pageSize > 100) pageSize = 100; // Giới hạn tối đa

        var count = await source.CountAsync();
        var items = await source.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(items, count, page, pageSize);
    }

    // PHƯƠNG THỨC ĐỒNG BỘ (cho trường hợp đặc biệt)
    public static PagedList<T> Create(IEnumerable<T> source, int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var count = source.Count();
        var items = source.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new PagedList<T>(items, count, page, pageSize);
    }
}
```

### Bước 2: Tạo ProductDto

**File:** `Models/Product/ProductDto.cs`

```csharp
namespace RetailStoreManagement.Models.Product;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}
```

### Bước 3: Cập nhật IProductService

**File:** `Interfaces/Services/IProductService.cs`

```csharp
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Product;

namespace RetailStoreManagement.Interfaces.Services;

public interface IProductService : IBaseService<ProductEntity>
{
    // Existing methods...

    // PHƯƠNG THỨC MỚI
    Task<PagedList<ProductDto>> GetProductsAsync(PagedRequest request);
    Task<PagedList<ProductDto>> SearchProductsAsync(PagedRequest request);
}
```

## 6. Testing Strategy

### Unit Tests

1. **`PagedListTests.cs`**:
   ```csharp
   [Test]
   public async Task CreateAsync_WithValidData_ReturnsCorrectPagedList()
   {
       // Arrange
       var mockData = GenerateMockProducts(50);
       var queryable = mockData.AsQueryable();

       // Act
       var result = await PagedList<Product>.CreateAsync(queryable, 2, 10);

       // Assert
       Assert.AreEqual(2, result.Page);
       Assert.AreEqual(10, result.PageSize);
       Assert.AreEqual(50, result.TotalCount);
       Assert.AreEqual(5, result.TotalPages);
       Assert.IsTrue(result.HasPrevious);
       Assert.IsTrue(result.HasNext);
   }
   ```

2. **`ProductServiceTests.cs`**:
   ```csharp
   [Test]
   public async Task GetProductsAsync_WithSearchTerm_ReturnsFilteredResults()
   {
       // Arrange
       var mockRepo = new Mock<IRepository<ProductEntity>>();
       var service = new ProductService(mockRepo.Object, _mapper);

       // Act & Assert
       // Test search functionality
   }
   ```

### Integration Tests

1. **`ProductControllerTests.cs`**:
   ```csharp
   [Test]
   public async Task GetProducts_WithPaginationParams_ReturnsPagedResponse()
   {
       // Arrange
       var client = _factory.CreateClient();

       // Act
       var response = await client.GetAsync("/api/products?page=1&pageSize=5&search=test");

       // Assert
       response.EnsureSuccessStatusCode();
       var content = await response.Content.ReadAsStringAsync();
       var result = JsonSerializer.Deserialize<ApiResponse<PagedList<ProductDto>>>(content);

       Assert.IsNotNull(result.Data);
       Assert.AreEqual(1, result.Data.Page);
       Assert.AreEqual(5, result.Data.PageSize);
   }
   ```

