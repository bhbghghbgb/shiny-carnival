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
