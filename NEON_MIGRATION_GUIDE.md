# Hướng dẫn Migration sang Neon Database

## Tổng quan
Dự án đã được cấu hình để sử dụng Neon Database (PostgreSQL) thay vì MySQL.

## Các thay đổi đã thực hiện

### 1. Cập nhật NuGet Packages (RetailStoreManagement.csproj)
- ❌ **Đã xóa**: `MySql.EntityFrameworkCore` (version 9.0.6)
- ✅ **Đã thêm**: `Npgsql.EntityFrameworkCore.PostgreSQL` (version 9.0.2)

### 2. Cập nhật Program.cs
- Thay đổi từ `options.UseMySQL(connectionString)` 
- Sang `options.UseNpgsql(connectionString)`

### 3. Cập nhật Connection String
Đã thêm connection string cho Neon PostgreSQL vào:
- `appsettings.json`
- `appsettings.Development.json`

Format connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=your-neon-host.neon.tech;Database=retail_store_db;Username=your-username;Password=your-password;SSL Mode=Require"
}
```

## Các bước tiếp theo để hoàn tất setup

### 1. Cấu hình Neon Database Connection String
Bạn cần cập nhật connection string trong `appsettings.Development.json` với thông tin từ Neon:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=<your-neon-host>.neon.tech;Database=<database-name>;Username=<username>;Password=<password>;SSL Mode=Require"
}
```

**Lấy thông tin từ Neon Dashboard:**
1. Đăng nhập vào https://neon.tech
2. Chọn project của bạn
3. Vào tab "Connection Details"
4. Copy connection string (chọn format .NET/C#)

### 2. Restore NuGet Packages
```bash
cd RetailStoreManagement
dotnet restore
```

### 3. Build Project
```bash
dotnet build
```

### 4. Tạo Migration cho PostgreSQL
Xóa các migration cũ (nếu có) và tạo migration mới:

```bash
# Xóa thư mục Migrations (nếu có)
rm -rf Migrations

# Tạo migration mới
dotnet ef migrations add InitialCreate

# Áp dụng migration vào database
dotnet ef database update
```

### 5. Chạy ứng dụng
```bash
dotnet run
```

## Lưu ý quan trọng

### Sự khác biệt giữa MySQL và PostgreSQL

1. **Case Sensitivity**: PostgreSQL phân biệt chữ hoa/thường trong tên bảng và cột
2. **Data Types**: Một số kiểu dữ liệu có thể khác nhau
3. **Auto Increment**: PostgreSQL sử dụng SERIAL/IDENTITY thay vì AUTO_INCREMENT
4. **Boolean**: PostgreSQL có kiểu BOOLEAN native, MySQL dùng TINYINT(1)

### SSL/TLS Connection
Neon database yêu cầu SSL connection, đã được cấu hình trong connection string với `SSL Mode=Require`

### Environment Variables (Khuyến nghị)
Để bảo mật hơn, nên sử dụng environment variables cho connection string:

```bash
export ConnectionStrings__DefaultConnection="Host=...;Database=...;Username=...;Password=...;SSL Mode=Require"
```

Hoặc sử dụng User Secrets trong development:
```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=...;Database=...;Username=...;Password=...;SSL Mode=Require"
```

## Kiểm tra kết nối

Sau khi cấu hình xong, bạn có thể kiểm tra kết nối bằng cách:

1. Chạy ứng dụng và truy cập Swagger UI: `http://localhost:5000/swagger`
2. Kiểm tra logs để đảm bảo không có lỗi kết nối database
3. Thử gọi một API endpoint để verify database hoạt động

## Troubleshooting

### Lỗi: "SSL connection is required"
- Đảm bảo connection string có `SSL Mode=Require`

### Lỗi: "password authentication failed"
- Kiểm tra lại username và password từ Neon dashboard
- Đảm bảo không có khoảng trắng thừa trong connection string

### Lỗi: "database does not exist"
- Tạo database trong Neon dashboard trước
- Hoặc để EF Core tự tạo khi chạy `dotnet ef database update`

## Tech Stack sau khi migration

- ✅ .NET 9.0
- ✅ EF Core 9.0.9
- ✅ Npgsql.EntityFrameworkCore.PostgreSQL 9.0.2
- ✅ Neon Database (PostgreSQL)
- ✅ Repository Pattern + Unit of Work
- ✅ JWT Authentication
- ✅ AutoMapper
- ✅ FluentValidation
- ✅ Swagger/OpenAPI

## Kết luận

Dự án đã được cấu hình hoàn chỉnh để sử dụng Neon Database. Tất cả các thay đổi code đã hoàn tất. Bạn chỉ cần:
1. Cập nhật connection string với thông tin từ Neon
2. Restore packages
3. Tạo và apply migrations
4. Chạy ứng dụng

Chúc bạn thành công! 🚀
