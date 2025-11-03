# Phân Tích Cơ Chế Phân Trang (Pagination)

Tài liệu này phân tích chi tiết cơ chế xử lý các yêu cầu và phản hồi đã được phân trang trong dự án.

## 1. Tổng Quan

Dự án áp dụng một cơ chế phân trang mạnh mẽ và tái sử dụng cao, cho phép client (ứng dụng mobile/web) yêu cầu dữ liệu theo từng đoạn (page) thay vì tải toàn bộ một lúc. Điều này giúp cải thiện đáng kể hiệu năng và trải nghiệm người dùng.

Cơ chế này được xây dựng dựa trên hai thành phần chính:
- **`PaginationRequest<T>`:** Một lớp generic để định nghĩa các tham số cho một yêu cầu có phân trang, tìm kiếm, và sắp xếp.
- **`PaginatedResponse<T>`:** Một lớp generic để đóng gói dữ liệu trả về cùng với các thông tin về phân trang (tổng số trang, tổng số mục, v.v.).

## 2. Các Thành Phần Chính

### a. `PaginationRequest<TResponse>`

Đây là lớp cơ sở cho tất cả các yêu cầu (query) cần phân trang.

**Vị trí:** `Application/Common/Models/PaginationRequest.cs`

**Cấu trúc:**
```csharp
public class PaginationRequest<TResponse> : IQuery<TResponse> where TResponse : class
{
    public string? SearchTerm { get; set; }
    public string? SortField { get; set; }
    public string? SortOrder { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }

    // ... constructor ...
}
```
- **`PageIndex`**: Số thứ tự của trang cần lấy (ví dụ: 1, 2, 3...).
- **`PageSize`**: Số lượng mục trên mỗi trang.
- **`SearchTerm`**, **`SortField`**, **`SortOrder`**: Các tham số mở rộng cho phép tìm kiếm và sắp xếp dữ liệu.

### b. `PaginatedResponse<T>`

Đây là lớp bao bọc kết quả trả về cho các yêu cầu phân trang.

**Vị trí:** `Application/Common/Models/PaginatedResponse.cs`

**Cấu trúc:**
```csharp
public class PaginatedResponse<T>(IReadOnlyCollection<T> items, int count, int pageNumber, int pageSize)
{
    public IReadOnlyCollection<T> Items { get; } // Danh sách các mục trên trang hiện tại
    public int PageNumber { get; set; } // Số trang hiện tại
    public int TotalPages { get; set; } // Tổng số trang
    public int TotalCount { get; set; } // Tổng số mục
    public bool HasPreviousPage => PageNumber > 1; // Có trang trước đó không?
    public bool HasNextPage => PageNumber < TotalPages; // Có trang tiếp theo không?

    // ... phương thức CreateAsync ...
}
```

### c. Phương thức `PaginatedResponse<T>.CreateAsync()`

Đây là trái tim của cơ chế phân trang. Nó nhận vào một `IQueryable<T>` và thực hiện phân trang trực tiếp trên cơ sở dữ liệu.

```csharp
public static async Task<PaginatedResponse<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
{
    int count = await source.CountAsync(); // 1. Đếm tổng số mục
    var items = await source.Skip((pageNumber - 1) * pageSize) // 2. Bỏ qua các mục của trang trước
                           .Take(pageSize) // 3. Lấy số lượng mục cho trang hiện tại
                           .ToListAsync();
    return new PaginatedResponse<T>(items, count, pageNumber, pageSize); // 4. Trả về kết quả
}
```
**Ưu điểm lớn nhất:** Bằng cách làm việc với `IQueryable`, các lệnh `Skip` và `Take` sẽ được Entity Framework Core dịch thành các câu lệnh SQL tương ứng (ví dụ: `OFFSET` và `FETCH` trong SQL Server), giúp việc phân trang được thực hiện ở tầng cơ sở dữ liệu, cực kỳ hiệu quả.

## 3. Luồng Hoạt Động và Ví dụ Chi Tiết

Chúng ta sẽ phân tích qua một ví dụ cụ thể: **Lấy danh sách nhà cung cấp (`Supplier`).**

### Bước 1: Tạo Query

Một lớp query mới được tạo ra, kế thừa từ `PaginationRequest`.

**File:** `Application/Features/CRM/Queries/GetSupplierQuery.cs`
```csharp
public class GetSupplierQuery : PaginationRequest<PaginatedResponse<SupplierDto>>
{
    // Lớp này có thể trống hoặc chứa thêm các thuộc tính lọc khác
}
```
- Bằng cách kế thừa, `GetSupplierQuery` tự động có các thuộc tính `PageIndex`, `PageSize`, v.v.
- Nó cũng chỉ định rằng kết quả trả về (`TResponse`) sẽ là `PaginatedResponse<SupplierDto>`.

### Bước 2: Gửi Yêu Cầu từ Client

Client sẽ gửi một yêu cầu `GET` đến một endpoint, ví dụ: `/api/crm/suppliers?pageIndex=1&pageSize=20&searchTerm=Vina`.

### Bước 3: Xử Lý trong Handler

`GetSupplierQueryHandlers` sẽ tiếp nhận và xử lý yêu cầu.

**File:** `Application/Features/CRM/Handlers/GetSupplierQueryHandlers.cs`
```csharp
public async Task<ApiResponse<PaginatedResponse<SupplierDto>>> Handle(GetSupplierQuery request, CancellationToken cancellationToken)
{
    // 1. Xây dựng câu truy vấn ban đầu
    var partnerSupplierQuery = _partnerSupplierRepo.GetAll()
            .Where(x => x.IsSupplier)
            // ... các Include khác ...
            .AsQueryable();

    // 2. Áp dụng điều kiện tìm kiếm (nếu có)
    if (!string.IsNullOrEmpty(request.SearchTerm))
    {
        partnerSupplierQuery = partnerSupplierQuery.Where(x => x.Name.Contains(request.SearchTerm));
    }

    // 3. Ánh xạ sang DTO (sử dụng AutoMapper.ProjectTo để giữ lại IQueryable)
    var supplierQuery = partnerSupplierQuery.ProjectTo<SupplierDto>(_mapper.ConfigurationProvider);

    // 4. Gọi phương thức phân trang
    var response = await PaginatedResponse<SupplierDto>.CreateAsync(supplierQuery, request.PageIndex, request.PageSize);
    
    // 5. Trả về kết quả đã được đóng gói
    return ApiResponse<PaginatedResponse<SupplierDto>>.Success(response);
}
```

**Giải thích luồng xử lý trong Handler:**
1.  Xây dựng một `IQueryable` ban đầu từ repository.
2.  Áp dụng các bộ lọc (filter) như `SearchTerm` vào `IQueryable`.
3.  Sử dụng `ProjectTo` của AutoMapper để định hình dữ liệu sang DTO mà vẫn duy trì được `IQueryable`. Đây là một bước quan trọng để tối ưu hóa câu lệnh SQL, chỉ `SELECT` những cột cần thiết.
4.  Gọi phương thức tĩnh `PaginatedResponse<T>.CreateAsync` và truyền vào `IQueryable` đã được xây dựng cùng với các tham số phân trang. Tại đây, logic `Skip().Take()` sẽ được thực thi trên cơ sở dữ liệu.
5.  Kết quả trả về là một đối tượng `PaginatedResponse` chứa danh sách các nhà cung cấp cho trang hiện tại và thông tin phân trang, được gói trong một `ApiResponse` tiêu chuẩn.

## 4. Kết Luận

Cơ chế phân trang của dự án được thiết kế tốt, hiệu quả và dễ dàng mở rộng:
- **Hiệu quả:** Phân trang được thực hiện ở tầng cơ sở dữ liệu, giảm thiểu lượng dữ liệu truyền qua mạng và lượng bộ nhớ sử dụng trên server.
- **Tái sử dụng:** Các lớp `PaginationRequest` và `PaginatedResponse` là generic, có thể được sử dụng cho bất kỳ loại dữ liệu nào cần phân trang.
- **Dễ sử dụng:** Để thêm chức năng phân trang cho một thực thể mới, nhà phát triển chỉ cần tạo một lớp Query kế thừa từ `PaginationRequest` và gọi phương thức `CreateAsync` trong Handler.
