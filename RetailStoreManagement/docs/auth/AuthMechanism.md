# Cơ Chế Xác Thực và Phân Quyền

Tài liệu này giải thích cơ chế bảo mật route, bao gồm quá trình xác thực (authentication) và phân quyền (authorization) trong ứng dụng.

## 1. Tổng quan

Hệ thống sử dụng **JSON Web Tokens (JWT)** theo chuẩn Bearer Token để bảo mật các API endpoint. Luồng hoạt động chung như sau:

1.  **Đăng nhập**: Người dùng gửi `username` và `password` đến endpoint `api/auth/login`.
2.  **Nhận Token**: Nếu thông tin hợp lệ, server sẽ trả về một JWT Token.
3.  **Gửi Token**: Với mỗi yêu cầu tiếp theo đến các endpoint được bảo vệ, người dùng phải đính kèm token này vào header `Authorization`.
4.  **Xác thực & Phân quyền**: Server xác thực token và kiểm tra xem người dùng có quyền truy cập vào tài nguyên được yêu cầu hay không.

## 2. Xác thực (Authentication) - "Bạn là ai?"

Đây là quá trình xác minh danh tính của người dùng dựa trên JWT token.

### a. Cấu hình

Việc xác thực token được cấu hình trong file `Program.cs`. Hệ thống sẽ kiểm tra các yếu tố sau của token:

-   **Chữ ký (Signature)**: Đảm bảo token không bị giả mạo bằng cách kiểm tra với `SecretKey`.
-   **Nhà phát hành (Issuer)**: Token có được phát hành bởi đúng server không.
-   **Đối tượng (Audience)**: Token có được dùng cho đúng ứng dụng không.
-   **Thời gian sống (Lifetime)**: Token có còn hạn sử dụng không.

```csharp
// File: Program.cs

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true, // Quan trọng nhất
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
        };
    });
```

### b. Middleware

Middleware `app.UseAuthentication()` sẽ tự động thực hiện quá trình xác thực này cho mỗi request đến.

## 3. Phân quyền (Authorization) - "Bạn được phép làm gì?"

Sau khi xác thực thành công, hệ thống sẽ kiểm tra quyền hạn của người dùng.

### a. Cơ chế áp dụng

Thay vì đặt attribute `[Authorize]` trên từng endpoint riêng lẻ, hệ thống áp dụng nó ở cấp độ **Controller Class**. Điều này có nghĩa là tất cả các endpoint bên trong một controller sẽ kế thừa cùng một quy tắc phân quyền.

### b. Ví dụ

#### Ví dụ 1: Yêu cầu Role "Admin"

Controller `UsersController` được bảo vệ bởi `[Authorize(Roles = "Admin")]`.

```csharp
// File: Controllers/Admin/UsersController.cs

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")] // <-- Áp dụng cho toàn bộ class
public class UsersController : ControllerBase
{
    // Tất cả các endpoint ở đây đều yêu cầu người dùng phải đăng nhập
    // và có vai trò là "Admin".

    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] PagedRequest request)
    {
        // ...
    }
}
```

#### Ví dụ 2: Yêu cầu đã đăng nhập (Bất kỳ Role nào)

Controller `CustomersController` được bảo vệ bởi `[Authorize]`.

```csharp
// File: Controllers/Admin/CustomersController.cs

[ApiController]
[Route("api/admin/customers")]
[Authorize] // <-- Áp dụng cho toàn bộ class
public class CustomersController : ControllerBase
{
    // Tất cả các endpoint ở đây chỉ yêu cầu người dùng phải đăng nhập
    // (có token hợp lệ), không phân biệt vai trò "Admin" hay "Staff".

    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] PagedRequest request)
    {
        // ...
    }
}
```

### c. Endpoint công khai

Các endpoint không yêu cầu xác thực, như `api/auth/login`, được đặt trong các controller có attribute `[AllowAnonymous]`.

```csharp
// File: Controllers/AuthController.cs

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous] // <-- Cho phép truy cập công khai
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // ...
    }
}
```

## Kết luận

Cơ chế bảo mật hiện tại được thiết kế theo lớp, áp dụng các quy tắc chung ở cấp độ controller để đảm bảo tính nhất quán, bảo mật và dễ bảo trì.
