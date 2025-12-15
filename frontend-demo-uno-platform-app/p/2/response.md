I'll help you build this Uno Platform app step by step. Let me break this down into manageable tasks:

## Task 1: Project Structure and Core Infrastructure

First, let's set up the basic project structure and core infrastructure.

```xml
/// ProductApp/ProductApp.csproj
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFramework>net8.0</TargetFramework>
        <OutputType>WinExe</OutputType>
        <UseUno>true</UseUno>
        <UseUnoExtensions>true</UseUnoExtensions>
        <UseToolkit>true</UseToolkit>
        <UnoPlatformVersion>5.2</UnoPlatformVersion>
        <UseMaterial>true</UseMaterial>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Uno.WinUI" Version="5.2.26" />
        <PackageReference Include="Uno.WinUI.Material" Version="5.2.26" />
        <PackageReference Include="Uno.Toolkit.WinUI.Material" Version="5.2.26" />
        <PackageReference Include="Uno.Extensions.Hosting.WinUI" Version="5.2.26" />
        <PackageReference Include="Uno.Extensions.Navigation.Toolkit.WinUI" Version="5.2.26" />
        <PackageReference Include="Uno.Extensions.Reactive.WinUI" Version="5.2.26" />

        <!-- Database -->
        <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.8" />

        <!-- API -->
        <PackageReference Include="Refit.HttpClientFactory" Version="7.0.0" />
        <PackageReference Include="Microsoft.Extensions.Http" Version="8.0.0" />

        <!-- Serialization -->
        <PackageReference Include="System.Text.Json" Version="8.0.4" />
    </ItemGroup>

    <ItemGroup>
        <UpToDateCheckInput Remove="**\*.xaml" />
    </ItemGroup>
</Project>
```

```csharp
/// ProductApp/App.xaml
<toolkit:MaterialApplication
    x:Class="ProductApp.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:toolkit="using:Uno.Toolkit.WinUI">

    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <XamlControlsResources xmlns="using:Microsoft.UI.Xaml.Controls" />
                <MaterialColors xmlns="using:Uno.Toolkit.WinUI" />
                <MaterialFonts xmlns="using:Uno.Toolkit.WinUI" />
                <MaterialResources xmlns="using:Uno.Toolkit.WinUI" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>
</toolkit:MaterialApplication>
```

```csharp
/// ProductApp/App.xaml.cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.UI.Xaml;
using ProductApp.Core.Services;
using ProductApp.Core.ViewModels;
using ProductApp.Data;
using ProductApp.Data.Repositories;
using Refit;
using System.Text.Json;

namespace ProductApp;

public sealed partial class App : Application
{
    private Window? _window;
    private IHost? _host;

    protected override void OnLaunched(LaunchActivatedEventArgs args)
    {
        var builder = this.CreateBuilder(args)
            .Configure(host =>
            {
                host
                .UseNavigation(RegisterRoutes)
                .ConfigureServices(ConfigureServices)
                .UseToolkitNavigation();
            });

        _window = builder.Window;
        _host = builder.Build();
        _window.Activate();
    }

    private static void ConfigureServices(HostBuilderContext context, IServiceCollection services)
    {
        // Database
        services.AddDbContext<AppDbContext>();
        services.AddTransient<ICartRepository, CartRepository>();

        // API Clients
        services.AddRefitClient<IAuthApi>(new RefitSettings
        {
            ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            })
        })
        .ConfigureHttpClient(client =>
        {
            client.BaseAddress = new Uri("http://10.0.2.2:5000"); // Android emulator
        });

        services.AddRefitClient<IProductApi>(new RefitSettings
        {
            ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            })
        })
        .ConfigureHttpClient(client =>
        {
            client.BaseAddress = new Uri("http://10.0.2.2:5000");
        });

        services.AddRefitClient<IOrderApi>(new RefitSettings
        {
            ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            })
        })
        .ConfigureHttpClient(client =>
        {
            client.BaseAddress = new Uri("http://10.0.2.2:5000");
        });

        // Services
        services.AddTransient<IAuthService, AuthService>();
        services.AddTransient<IProductService, ProductService>();
        services.AddTransient<IOrderService, OrderService>();

        // ViewModels
        services.AddTransient<LoginViewModel>();
        services.AddTransient<HomeViewModel>();
        services.AddTransient<ProductDetailViewModel>();
        services.AddTransient<CartViewModel>();
        services.AddTransient<OrderConfirmationViewModel>();
    }

    private static void RegisterRoutes(IViewRegistry views, IRouteRegistry routes)
    {
        views.Register(
            new ViewMap<LoginPage, LoginViewModel>(),
            new ViewMap<HomePage, HomeViewModel>(),
            new ViewMap<ProductDetailPage, ProductDetailViewModel>(),
            new ViewMap<CartPage, CartViewModel>(),
            new ViewMap<OrderConfirmationPage, OrderConfirmationViewModel>()
        );

        routes.Register(
            new RouteMap("", View: views.FindByViewModel<LoginViewModel>()),
            new RouteMap("Login", View: views.FindByViewModel<LoginViewModel>()),
            new RouteMap("Home", View: views.FindByViewModel<HomeViewModel>()),
            new RouteMap("ProductDetail", View: views.FindByViewModel<ProductDetailViewModel>()),
            new RouteMap("Cart", View: views.FindByViewModel<CartViewModel>()),
            new RouteMap("OrderConfirmation", View: views.FindByViewModel<OrderConfirmationViewModel>())
        );
    }
}
```

```csharp
/// ProductApp/Models/LoginRequest.cs
namespace ProductApp.Models;

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

```csharp
/// ProductApp/Models/LoginResponse.cs
namespace ProductApp.Models;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}
```

```csharp
/// ProductApp/Models/UserDto.cs
namespace ProductApp.Models;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Role { get; set; }
}
```

```csharp
/// ProductApp/Models/ProductListDto.cs
namespace ProductApp.Models;

public class ProductListDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
    public int InventoryQuantity { get; set; }
}
```

```csharp
/// ProductApp/Models/CreateOrderRequest.cs
using System.ComponentModel.DataAnnotations;

namespace ProductApp.Models;

public class CreateOrderRequest
{
    [Required]
    public int CustomerId { get; set; }

    [MaxLength(50)]
    public string? PromoCode { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Order must have at least one item.")]
    public List<OrderItemInput> OrderItems { get; set; } = new();
}
```

```csharp
/// ProductApp/Models/OrderItemInput.cs
using System.ComponentModel.DataAnnotations;

namespace ProductApp.Models;

public class OrderItemInput
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}
```

This completes Task 1. The project now has:

1. **Updated project file** with all necessary dependencies
2. **App configuration** with dependency injection setup
3. **Navigation system** with route registration
4. **Core models** for authentication and products
5. **API client configuration** for Refit

Key features implemented:

- SQLite with Entity Framework Core
- Refit for typed API clients
- Dependency Injection with Microsoft.Extensions
- Navigation with Uno.Extensions
- Android localhost configuration (10.0.2.2 for emulator)

Would you like me to continue with Task 2: Database Setup and Data Layer?
