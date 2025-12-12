# Hướng dẫn Cấu hình Xác thực Bearer Token trong Swagger UI

Tài liệu này hướng dẫn cách cấu hình Swagger UI để hiển thị nút "Authorize", cho phép người dùng nhập JWT Bearer token và gửi nó trong header của các yêu cầu API. Điều này rất cần thiết để kiểm thử các endpoint yêu cầu xác thực.

## Bối cảnh

Khi các endpoint của API được bảo vệ (yêu cầu xác thực), bạn không thể gọi chúng trực tiếp từ Swagger UI mà không cung cấp một token hợp lệ. Việc cấu hình xác thực trong Swagger sẽ tạo ra một giao diện tiện lợi để:

1.  **Nhập Token:** Cung cấp một ô nhập liệu để dán token nhận được từ endpoint đăng nhập.
2.  **Tự động Gửi Token:** Swagger sẽ tự động đính kèm token vào header `Authorization` của mỗi yêu cầu được gửi đi từ UI.

## Các Bước Cấu hình

Việc cấu hình được thực hiện bên trong phương thức `AddSwaggerGen` khi bạn đăng ký dịch vụ Swagger. Trong dự án này, mã nguồn nằm tại `WebApi/Extensions/ServiceCollectionExtensions.cs` trong phương thức `AddSwagger`.

Có hai bước chính để hoàn tất việc này:

### Bước 1: Định nghĩa Lược đồ Bảo mật (Define the Security Scheme)

Đầu tiên, bạn cần cho Swagger biết về loại xác thực bạn muốn sử dụng. Trong trường hợp này là "Bearer" token (JWT).

Sử dụng phương thức `AddSecurityDefinition` để định nghĩa một lược đồ bảo mật mới.

**Mã nguồn trong dự án:**
```csharp
options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    In = ParameterLocation.Header,
    Description = "Please enter a valid token",
    Name = "Authorization",
    Type = SecuritySchemeType.Http,
    BearerFormat = "JWT",
    Scheme = "Bearer"
});
```

**Giải thích:**
- `"Bearer"`: Là tên định danh cho lược đồ bảo mật này.
- `In = ParameterLocation.Header`: Chỉ định rằng token sẽ được gửi trong header của yêu cầu.
- `Description`: Một đoạn mô tả ngắn sẽ hiển thị trên UI của Swagger.
- `Name = "Authorization"`: Tên của header chứa token.
- `Type = SecuritySchemeType.Http`: Loại lược đồ bảo mật là HTTP.
- `BearerFormat = "JWT"`: Định dạng của token.
- `Scheme = "Bearer"`: Lược đồ được sử dụng (sẽ có tiền tố "Bearer " trước token).

### Bước 2: Áp dụng Yêu cầu Bảo mật (Apply the Security Requirement)

Sau khi đã định nghĩa lược đồ, bạn cần áp dụng nó cho các endpoint của mình. Bạn có thể áp dụng cho từng endpoint cụ thể hoặc áp dụng cho tất cả các endpoint trên toàn cục.

Sử dụng phương thức `AddSecurityRequirement` để yêu cầu Swagger sử dụng lược đồ bảo mật đã định nghĩa.

**Mã nguồn trong dự án:**
```csharp
options.AddSecurityRequirement(new OpenApiSecurityRequirement
{
    {
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        Array.Empty<string>()
    }
});
```

**Giải thích:**
- Đoạn mã này tạo ra một yêu cầu bảo mật mới.
- `Reference`: Nó tham chiếu đến lược đồ bảo mật có `Id = "Bearer"` mà chúng ta đã định nghĩa ở Bước 1.
- `Array.Empty<string>()`: Một danh sách các scope yêu cầu (không cần thiết cho Bearer token).

Khi áp dụng trên toàn cục như thế này, tất cả các endpoint sẽ hiển thị biểu tượng ổ khóa và yêu cầu token khi được gọi từ Swagger UI.

## Kết luận

Dự án của bạn **đã được cấu hình đầy đủ** với các thiết lập trên. Khi bạn chạy ứng dụng và truy cập vào giao diện Swagger, bạn sẽ thấy một nút **"Authorize"** ở góc trên bên phải.

**Để sử dụng:**
1.  Gọi endpoint `POST /api/identity/auth/login` để lấy token.
2.  Nhấp vào nút **"Authorize"**.
3.  Trong hộp thoại hiện ra, nhập `Bearer <your_token>` (ví dụ: `Bearer eyJhbGci...`) vào ô giá trị và nhấp **Authorize**.
4.  Bây giờ bạn có thể gọi các endpoint được bảo vệ khác một cách bình thường.
