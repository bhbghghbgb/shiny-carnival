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
        
        // Initialize database
        InitializeDatabase();
        
        _window.Activate();
    }

    private async void InitializeDatabase()
    {
        try
        {
            using var scope = _host!.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.InitializeAsync();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Database initialization failed: {ex.Message}");
        }
    }

    private static void ConfigureServices(HostBuilderContext context, IServiceCollection services)
    {
        // Configuration
        services.AddSingleton<AppConfig>(new AppConfig 
        { 
            UseFakeData = true, // Set to false when backend is ready
            BaseApiUrl = "http://10.0.2.2:5000",
            EnableLogging = true
        });
        
        // Fake Data Service
        services.AddSingleton<IFakeDataService, FakeDataService>();

        // Database
        services.AddDbContext<AppDbContext>();
        services.AddTransient<ICartRepository, CartRepository>();
        
        // API Clients (will use fake data when UseFakeData = true)
        services.AddRefitClient<IAuthApi>(new RefitSettings
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
        services.AddTransient<ProductListViewModel>();
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
