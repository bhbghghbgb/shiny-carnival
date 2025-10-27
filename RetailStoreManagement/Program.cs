using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RetailStoreManagement.Data;
using RetailStoreManagement.Filters;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Repositories;
using RetailStoreManagement.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Database Configuration
// ============================================================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
        throw new InvalidOperationException("⚠️ Connection string 'DefaultConnection' không được tìm thấy trong appsettings.json.");

    options.UseMySQL(connectionString);
});

// ============================================================================
// Dependency Injection (DI)
// ============================================================================

// Generic repository & service
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));

// Register generic service
builder.Services.AddScoped(typeof(IBaseService<,>), typeof(BaseService<,>));

// Unit of Work (nếu có)
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Specific repositories & services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

// ============================================================================
// AutoMapper & FluentValidation
// ============================================================================
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// ============================================================================
// Authentication (JWT Bearer Token)
// ============================================================================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "store-management",
            ValidAudience = "store-management",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("your-super-secret-key-at-least-32-chars"))
        };
    });

// ============================================================================
// Controllers & Global Filters + JSON Options
// ============================================================================
builder.Services.AddControllers(options =>
{
    // Bộ lọc chuẩn hóa phản hồi API & xử lý lỗi
    options.Filters.Add<ApiResponseFilter>();
})
.AddJsonOptions(options =>
{
    // Bỏ qua vòng lặp tuần hoàn khi serialize JSON (Category <-> Product)
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// ============================================================================
// Swagger / OpenAPI
// ============================================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ============================================================================
// Build Application
// ============================================================================
var app = builder.Build();

// Tự động tạo database + bảng nếu chưa có
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
}

// ============================================================================
// HTTP Request Pipeline
// ============================================================================
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();

    // Redirect "/" → Swagger UI
    app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/")
        {
            context.Response.Redirect("/swagger");
            return;
        }

        await next();
    });
}

// ============================================================================
// Middlewares thứ tự chuẩn
// ============================================================================
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
