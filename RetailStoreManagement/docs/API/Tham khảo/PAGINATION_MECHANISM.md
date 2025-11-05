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

## 4. Xác Thực Đầu Vào Với PaginationRequestValidator

Dự án sử dụng thư viện `FluentValidation` để xác thực các yêu cầu phân trang, đảm bảo dữ liệu đầu vào hợp lệ trước khi xử lý.

### a. `PaginationRequestValidator<T>`

Lớp validator này được thiết kế để xác thực các thuộc tính cơ bản của yêu cầu phân trang:

**Vị trí:** `Application/Common/Models/PaginationRequest.cs`

**Cấu trúc:**
```csharp
public class PaginationRequestValidator<T> : AbstractValidator<T> where T : PaginationRequest<T>
{
    public PaginationRequestValidator()
    {
        RuleFor(x => x.PageIndex)
            .NotNull()
            .NotEmpty()
            .GreaterThan(0);

        RuleFor(x => x.PageSize)
            .NotNull()
            .NotEmpty()
            .GreaterThan(0);
    }
}
```

**Chi tiết xác thực:**
- **`PageIndex`**: Phải khác null, không rỗng và lớn hơn 0
- **`PageSize`**: Phải khác null, không rỗng và lớn hơn 0

**Lợi ích:**
- Ngăn chặn các giá trị không hợp lệ gây lỗi khi thực hiện phân trang
- Giảm thiểu lỗi từ phía client bằng cách trả về lỗi xác thực rõ ràng
- Đảm bảo tính nhất quán trong việc xử lý yêu cầu phân trang.

## 5. Cả Hai Phương Thức Create và CreateAsync

Lớp `PaginatedResponse<T>` cung cấp cả hai phương thức để tạo kết quả phân trang: một phương thức bất đồng bộ (async) và một phương thức đồng bộ, cho phép linh hoạt trong các tình huống sử dụng khác nhau.

### a. `CreateAsync` - Phương thức bất đồng bộ

Phương thức này được sử dụng khi làm việc với `IQueryable<T>` từ Entity Framework, cho phép thực hiện phân trang trực tiếp trên cơ sở dữ liệu:

```csharp
public static async Task<PaginatedResponse<T>> CreateAsync(IQueryable<T> source, int pageNumber = 1, int pageSize = 10)
{
    if (pageNumber <= 0) pageNumber = 1;
    if (pageSize <= 0) pageSize = 1;

    int count = await source.CountAsync();
    var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
    return new PaginatedResponse<T>(items, count, pageNumber, pageSize);
}
```

**Ưu điểm:**
- Phân trang được thực hiện tại tầng cơ sở dữ liệu
- Hiệu suất cao khi làm việc với lượng dữ liệu lớn
- Hạn chế bộ nhớ sử dụng trên server

### b. `Create` - Phương thức đồng bộ

Phương thức này được sử dụng khi làm việc với `IEnumerable<T>`, phù hợp cho các tình huống cần xử lý dữ liệu đã được tải vào bộ nhớ:

```csharp
public static PaginatedResponse<T> Create(IEnumerable<T> sources, int pageNumber, int pageSize)
{
    if (pageNumber <= 0) pageNumber = 1;
    if (pageSize <= 0) pageSize = 1;

    var count = sources.Count();
    var items = sources.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
    return new PaginatedResponse<T>(items, count, pageNumber, pageSize);
}
```

**Ứng dụng:**
- Khi dữ liệu đã được tải hoàn toàn vào bộ nhớ
- Trong các tình huống xử lý dữ liệu không đến từ database
- Khi cần áp dụng logic xử lý đặc biệt trước khi phân trang

## 6. Tích Hợp Với MediatR và CQRS Pattern

Cơ chế phân trang được tích hợp chặt chẽ với mô hình CQRS (Command Query Responsibility Segregation) và thư viện MediatR để đảm bảo tính nhất quán và khả năng mở rộng của hệ thống.

### a. Cấu trúc CQRS trong phân trang

**Query (Yêu cầu):**
- `PaginationRequest<TResponse>` kế thừa từ `IQuery<TResponse>`
- Định nghĩa các tham số phân trang, tìm kiếm và sắp xếp

**Handler (Xử lý):**
- Triển khai `IRequestHandler<TQuery, TResponse>` hoặc `IQueryHandler<TQuery, TResponse>`
- Xử lý logic phân trang và trả về kết quả

**Ví dụ minh họa:**
```csharp
// Query
public class GetSupplierQuery : PaginationRequest<ApiResponse<PaginatedResponse<SupplierDto>>>
{
    // Lớp này kế thừa các thuộc tính phân trang từ PaginationRequest
}

// Handler
public class GetSupplierQueryHandlers(
    IUnitOfWork unitOfWork,
    IMapper mapper)
    : IRequestHandler<GetSupplierQuery, ApiResponse<PaginatedResponse<SupplierDto>>>
{
    public async Task<ApiResponse<PaginatedResponse<SupplierDto>>> Handle(GetSupplierQuery request, CancellationToken cancellationToken)
    {
        // Xây dựng truy vấn
        var partnerSupplierQuery = _partnerSupplierRepo.GetAll()
                .Where(x => x.IsSupplier)
                .Include(x => x.Nationality)
                .Include(x => x.QualityAgreement)
                .AsQueryable();

        // Áp dụng tìm kiếm nếu có
        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            var searchTerm = request.SearchTerm.Trim();
            partnerSupplierQuery = partnerSupplierQuery.Where(x => x.Name != null && x.Name.Contains(searchTerm));
        }

        // Ánh xạ sang DTO
        var supplierQuery = partnerSupplierQuery.ProjectTo<SupplierDto>(_mapper.ConfigurationProvider);

        // Tạo kết quả phân trang
        var response = await PaginatedResponse<SupplierDto>.CreateAsync(supplierQuery, request.PageIndex, request.PageSize);
        return ApiResponse<PaginatedResponse<SupplierDto>>.Success(response);
    }
}
```

### b. Lợi ích của việc sử dụng CQRS với MediatR

- **Tách biệt trách nhiệm:** Phân biệt rõ ràng giữa các yêu cầu đọc (Query) và ghi (Command)
- **Khả năng mở rộng:** Dễ dàng thêm middleware, logging, caching cho các xử lý
- **Tính nhất quán:** Cung cấp một mô hình xử lý yêu cầu thống nhất
- **Khả năng kiểm thử:** Dễ dàng mock và test từng thành phần

## 7. Các Nguyên Tắc Tối Ưu Hiệu Năng

Dự án áp dụng nhiều nguyên tắc và kỹ thuật để tối ưu hiệu suất của cơ chế phân trang, đặc biệt khi làm việc với lượng dữ liệu lớn.

### a. Sử dụng AsNoTracking trong Entity Framework

Một số handler sử dụng `AsNoTracking()` để tăng hiệu suất khi chỉ đọc dữ liệu:

```csharp
var query = _repository.GetAll()
    .AsNoTracking()  // Tắt theo dõi thực thể để tăng hiệu suất
    .Include(x => x.Department)
    .Include(x => x.Company)
    .OrderByDescending(x => x.CreatedDate)
    .AsQueryable();
```

**Lợi ích:**
- Giảm bộ nhớ sử dụng bởi Context
- Tăng tốc độ truy vấn khi chỉ đọc dữ liệu
- Tránh overhead của change tracking

### b. Tối ưu hóa truy vấn với ProjectTo của AutoMapper

Sử dụng `ProjectTo<T>()` thay vì `Map()` để duy trì `IQueryable` và đảm bảo ánh xạ được thực hiện tại tầng cơ sở dữ liệu:

```csharp
var supplierQuery = partnerSupplierQuery.ProjectTo<SupplierDto>(_mapper.ConfigurationProvider);
```

**Lợi ích:**
- Chỉ SELECT các cột cần thiết từ database
- Giảm lượng dữ liệu truyền qua mạng
- Tăng tốc độ truy vấn

### c. Tích hợp bộ nhớ đệm (Cache)

Một số handler có thể tích hợp với Redis cache để cải thiện hiệu suất:

```csharp
// Ví dụ cấu trúc handler có thể sử dụng cache
public class SearchPalletStockInQueryHandler(ICurrentUser user, IFabricAppearanceInspectionRepository appearanceRepository)
    : IQueryHandler<SearchPalletStockInQuery, PaginatedResponse<QuickSearchPalletDto>>
{
    // Logic xử lý có thể bao gồm cache
}
```

**Lợi ích:**
- Giảm tải cho cơ sở dữ liệu
- Tăng tốc độ phản hồi cho các truy vấn thường xuyên
- Cải thiện trải nghiệm người dùng

### d. Phân trang tại cơ sở dữ liệu

Cả hai phương thức `CreateAsync` và `Create` đều sử dụng `Skip()` và `Take()` để thực hiện phân trang tại tầng cơ sở dữ liệu:

```csharp
var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
```

**Lợi ích:**
- Giảm lượng dữ liệu truyền qua mạng
- Giảm bộ nhớ sử dụng trên server
- Tăng hiệu suất khi làm việc với dữ liệu lớn

## 8. Phân Quyền và Bảo Mật Trong Phân Trang

Dự án áp dụng các cơ chế phân quyền và bảo mật để đảm bảo dữ liệu chỉ được truy cập bởi những người dùng có quyền hợp lệ.

### a. Kiểm tra quyền truy cập trong Handler

Nhiều handler sử dụng `ICurrentUser` để xác định quyền hạn của người dùng và áp dụng các bộ lọc tương ứng:

```csharp
public class GetFabricStockInByLocationQueryHandler(IUnitOfWork unitOfWork, ICurrentUser user, IFabricStockInService fabricStockInService) : IQueryHandler<GetFabricStockInByLocationQuery, PaginatedResponse<FabricStockInDto>>
{
    public async Task<ApiResponse<PaginatedResponse<FabricStockInDto>>> Handle(GetFabricStockInByLocationQuery request, CancellationToken cancellationToken)
    {
        // Kiểm tra quyền truy cập và áp dụng bộ lọc theo công ty người dùng
        var query = fabricStockInService.GetFabricStockInQuery(user.CompanyId, request.WarehouseLocationId);
        
        // Xử lý phân trang
        var res = await PaginatedResponse<FabricStockInDto>.CreateAsync(query, request.PageIndex, request.PageSize);
        return ApiResponse<PaginatedResponse<FabricStockInDto>>.Success(res);
    }
}
```

### b. Bộ lọc theo công ty/đơn vị

Nhiều handler áp dụng bộ lọc theo công ty để đảm bảo người dùng chỉ thấy dữ liệu thuộc quyền truy cập:

```csharp
// Trong handler GetUsersQueryHandler
if (request.CompanyId > 0) query = query.Where(x => x.CompanyId == request.CompanyId);
if (request.DepartmentId > 0) query = query.Where(x => x.DepartmentId == request.DepartmentId);
```

### c. Kiểm tra tồn tại và trạng thái của thực thể

Một số handler kiểm tra xem thực thể có tồn tại và đang hoạt động trước khi thực hiện phân trang:

```csharp
var whLocation = await _whLocationRepo.GetAsync(request.WarehouseLocationId);
if (whLocation is null || !whLocation.Activated)
    return ApiResponse<PaginatedResponse<FabricStockInDto>>.Failure(AppConst.MSG_C2.Frmat(request.WarehouseLocationId));
```

## 9. Các Mẫu Thiết Kế Được Sử Dụng

Cơ chế phân trang trong dự án áp dụng nhiều mẫu thiết kế phổ biến để đảm bảo tính linh hoạt, khả năng mở rộng và dễ bảo trì.

### a. CQRS (Command Query Responsibility Segregation)

- **Query:** `PaginationRequest<TResponse>` đại diện cho các yêu cầu đọc dữ liệu
- **Handler:** Xử lý các yêu cầu Query và trả về kết quả
- **Lợi ích:** Tách biệt trách nhiệm giữa đọc và ghi dữ liệu

### b. Repository Pattern

- **UnitOfWork:** `IUnitOfWork` quản lý các repository
- **Generic Repository:** `IGenericRepository<T>` cung cấp các thao tác cơ bản cho bất kỳ thực thể nào
- **Lợi ích:** Tách biệt logic truy cập dữ liệu khỏi logic nghiệp vụ

### c. DTO (Data Transfer Object)

- **Mục đích:** Truyền dữ liệu giữa các lớp mà không phơi bày cấu trúc nội bộ
- **AutoMapper:** Sử dụng `ProjectTo<T>()` để ánh xạ hiệu quả từ thực thể sang DTO
- **Lợi ích:** Giảm coupling giữa các lớp, cải thiện bảo mật dữ liệu

### d. Generic Pattern

- **PaginationRequest<TResponse>:** Lớp generic cho các yêu cầu phân trang
- **PaginatedResponse<T>:** Lớp generic cho phản hồi phân trang
- **Lợi ích:** Tái sử dụng cao, giảm code trùng lặp

### e. Validator Pattern

- **FluentValidation:** Cung cấp cơ chế xác thực mạnh mẽ và dễ đọc
- **PaginationRequestValidator<T>:** Xác thực các yêu cầu phân trang
- **Lợi ích:** Đảm bảo dữ liệu đầu vào hợp lệ, dễ mở rộng quy tắc xác thực

## 10. Ví Dụ Đa Dạng Từ Codebase

Dưới đây là các ví dụ thực tế từ codebase cho thấy cách cơ chế phân trang được áp dụng trong các tình huống khác nhau:

### a. Phân trang danh sách người dùng

**File:** `Application/Features/Users/Handlers/GetUserQueryHandler.cs`

```csharp
public async Task<ApiResponse<PaginatedResponse<UserDto>>> Handle(GetUserQuery request, CancellationToken cancellationToken)
{
    var query = _repository.GetAll()
        .Include(x => x.Department)
        .Include(x => x.Company)
        .OrderByDescending(x => x.CreatedDate)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        query = query.Where(x => x.UserName.Contains(request.SearchTerm) || x.Email!.Contains(request.SearchTerm));
    if (request.CompanyId > 0)
        query = query.Where(x => x.CompanyId == request.CompanyId);
    if (request.DepartmentId > 0)
        query = query.Where(x => x.DepartmentId == request.DepartmentId);

    var sql = query.Select(x => new UserDto
    {
        Id = x.Id,
        UserName = x.UserName,
        DateJoined = x.CreatedDate,
        CompanyId = x.CompanyId,
        CompanyName = x.Company!.Name,
        FullName = x.FullName,
        DepartmentName = x.Department!.Name,
        PhoneNumber = x.PhoneNumber,
        Email = x.Email,
        PhotoPath = x.PhotoPath,
        QrCodePath = x.QRCodePath
    });

    var res = await PaginatedResponse<UserDto>.CreateAsync(sql, request.PageIndex, request.PageSize);
    return ApiResponse<PaginatedResponse<UserDto>>.Success(res);
}
```

### b. Phân trang danh sách nhà cung cấp

**File:** `Application/Features/CRM/Handlers/GetSupplierQueryHandlers.cs`

```csharp
public async Task<ApiResponse<PaginatedResponse<SupplierDto>>> Handle(GetSupplierQuery request, CancellationToken cancellationToken)
{
    var partnerSupplierQuery = _partnerSupplierRepo.GetAll()
            .Where(x => x.IsSupplier)
            .Include(x => x.Nationality)
            .Include(x => x.QualityAgreement)
            .Include(x => x.CreatedByUser)
            .AsQueryable();

    if (!string.IsNullOrEmpty(request.SearchTerm))
    {
        var searchTerm = request.SearchTerm.Trim();
        partnerSupplierQuery = partnerSupplierQuery.Where(x => x.Name != null && x.Name.Contains(searchTerm));
    }

    var supplierQuery = partnerSupplierQuery.ProjectTo<SupplierDto>(_mapper.ConfigurationProvider);

    var response = await PaginatedResponse<SupplierDto>.CreateAsync(supplierQuery, request.PageIndex, request.PageSize);
    return ApiResponse<PaginatedResponse<SupplierDto>>.Success(response);
}
```

### c. Phân trang dữ liệu kho hàng

**File:** `Application/Features/Warehouses/Handlers/GetFabricStockInByLocationQueryHandler.cs`

```csharp
public async Task<ApiResponse<PaginatedResponse<FabricStockInDto>>> Handle(GetFabricStockInByLocationQuery request, CancellationToken cancellationToken)
{
    var whLocation = await _whLocationRepo.GetAsync(request.WarehouseLocationId);
    if (whLocation is null || !whLocation.Activated)
        return ApiResponse<PaginatedResponse<FabricStockInDto>>.Failure(AppConst.MSG_C2.Frmat(request.WarehouseLocationId));

    var query = fabricStockInService.GetFabricStockInQuery(user.CompanyId, request.WarehouseLocationId);
    if (!string.IsNullOrWhiteSpace(request.SearchTerm))
    {
        query = query.Where(x => x.MasterPOCode.Equals(request.SearchTerm)
                    || x.FabricFastCode!.Equals(request.SearchTerm)
                    || x.LotNumber!.Equals(request.SearchTerm)
                    || x.FabricCode!.Equals(request.SearchTerm)
                    || x.FabricName!.Equals(request.SearchTerm)
                    || x.CustomerName!.Equals(request.SearchTerm)
                    || x.FabricColorExt!.Equals(request.SearchTerm));
    }

    var res = await PaginatedResponse<FabricStockInDto>.CreateAsync(query, request.PageIndex, request.PageSize);
    return ApiResponse<PaginatedResponse<FabricStockInDto>>.Success(res);
}
```

## 11. Các Thực Hành Tốt Trong Phân Trang

Dưới đây là các thực hành tốt (best practices) được áp dụng trong cơ chế phân trang của dự án:

### a. Luôn xác thực đầu vào

Sử dụng `PaginationRequestValidator<T>` để đảm bảo các tham số phân trang hợp lệ trước khi xử lý.

### b. Sử dụng AsNoTracking khi chỉ đọc dữ liệu

Tắt theo dõi thực thể khi thực hiện các truy vấn chỉ đọc để tăng hiệu suất.

### c. Tối ưu hóa truy vấn với ProjectTo

Sử dụng `ProjectTo<T>()` của AutoMapper để duy trì `IQueryable` và thực hiện ánh xạ tại tầng cơ sở dữ liệu.

### d. Áp dụng bộ lọc theo quyền hạn người dùng

Luôn áp dụng các bộ lọc theo công ty, phòng ban hoặc quyền hạn để đảm bảo bảo mật dữ liệu.

### e. Xử lý lỗi một cách nhất quán

Sử dụng `ApiResponse<T>` để đóng gói kết quả và lỗi một cách nhất quán.

### f. Giới hạn kích thước trang

Thiết lập giới hạn tối đa cho `PageSize` để tránh yêu cầu quá lớn ảnh hưởng đến hiệu suất hệ thống.

### g. Sắp xếp mặc định

Luôn có một trường sắp xếp mặc định để đảm bảo kết quả phân trang nhất quán.

### h. Kiểm tra tồn tại của thực thể

Trước khi thực hiện phân trang trên một thực thể cụ thể, kiểm tra xem thực thể đó có tồn tại và hợp lệ không.

## 12. Kết Luận

Cơ chế phân trang của dự án được thiết kế toàn diện, hiệu quả và dễ dàng mở rộng:
- **Hiệu quả:** Phân trang được thực hiện ở tầng cơ sở dữ liệu, giảm thiểu lượng dữ liệu truyền qua mạng và lượng bộ nhớ sử dụng trên server.
- **Tái sử dụng:** Các lớp `PaginationRequest` và `PaginatedResponse` là generic, có thể được sử dụng cho bất kỳ loại dữ liệu nào cần phân trang.
- **Dễ sử dụng:** Để thêm chức năng phân trang cho một thực thể mới, nhà phát triển chỉ cần tạo một lớp Query kế thừa từ `PaginationRequest` và gọi phương thức `CreateAsync` trong Handler.
- **An toàn:** Cơ chế xác thực đầu vào và kiểm tra quyền hạn giúp đảm bảo dữ liệu được truy cập một cách an toàn.
- **Tối ưu:** Áp dụng nhiều kỹ thuật tối ưu hiệu suất như AsNoTracking, ProjectTo, và phân trang tại cơ sở dữ liệu.
