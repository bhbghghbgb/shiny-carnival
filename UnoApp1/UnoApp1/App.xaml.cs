using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.UI.Xaml;
using UnoApp1.Core.Services;
using UnoApp1.Core.ViewModels;
using UnoApp1.Data;
using UnoApp1.Data.Repositories;
using Refit;
using System.Text.Json;
using Uno.Resizetizer;
using Uno.Extensions;
using Uno.Extensions.Navigation;
using Uno.Extensions.Logging;
using Uno.Extensions.Configuration;
using Uno.Extensions.Localization;
using Uno.Toolkit.UI;
using UnoApp1.Views;

namespace UnoApp1;

public sealed partial class App : Application
{
    /// <summary>
    /// Initializes the singleton application object. This is the first line of authored code
    /// executed, and as such is the logical equivalent of main() or WinMain().
    /// </summary>
    public App()
    {
        this.InitializeComponent();
    }

    protected Window? MainWindow { get; private set; }
    protected IHost? Host { get; private set; }

    /// <summary>
    /// Entry point for launching the application.
    /// </summary>
    protected async override void OnLaunched(LaunchActivatedEventArgs args)
    {
        var builder = this.CreateBuilder(args)
            // Add navigation support for toolkit controls such as TabBar and NavigationView
            .UseToolkitNavigation()
            .Configure(host =>
            {
#if DEBUG
                // Switch to Development environment when running in DEBUG
                host.UseEnvironment(Environments.Development);
#endif
                host
                    .UseLogging((context, logBuilder) =>
                    {
                        // Configure log levels for different categories of logging
                        logBuilder
                            .SetMinimumLevel(
                                context.HostingEnvironment.IsDevelopment() ? LogLevel.Information : LogLevel.Warning)

                            // Default filters for core Uno Platform namespaces
                            .CoreLogLevel(LogLevel.Warning);

                        // Uno Platform namespace filter groups
                        // Uncomment individual methods to see more detailed logging
                        //// Generic Xaml events
                        //logBuilder.XamlLogLevel(LogLevel.Debug);
                        //// Layout specific messages
                        //logBuilder.XamlLayoutLogLevel(LogLevel.Debug);
                        //// Storage messages
                        //logBuilder.StorageLogLevel(LogLevel.Debug);
                        //// Binding related messages
                        //logBuilder.XamlBindingLogLevel(LogLevel.Debug);
                        //// Binder memory references tracking
                        //logBuilder.BinderMemoryReferenceLogLevel(LogLevel.Debug);
                        //// DevServer and HotReload related
                        //logBuilder.HotReloadCoreLogLevel(LogLevel.Information);
                        //// Debug JS interop
                        //logBuilder.WebAssemblyLogLevel(LogLevel.Debug);
                    }, enableUnoLogging: true)
                    .UseSerilog(consoleLoggingEnabled: true, fileLoggingEnabled: true)
                    .UseConfiguration(configBuilder =>
                        configBuilder
                            .EmbeddedSource<App>()
                            .Section<AppConfig>())
                    // Enable localization (see appsettings.json for supported languages)
                    .UseLocalization()
                    .UseHttp((context, services) =>
                    {
#if DEBUG
                        // DelegatingHandler will be automatically injected
                        services.AddTransient<DelegatingHandler, DebugHttpHandler>();
#endif
                    })
                    .ConfigureServices(ConfigureServices)
                    .UseNavigation(RegisterRoutes);
            });

        MainWindow = builder.Window;

#if DEBUG
        MainWindow.UseStudio();
#endif
        MainWindow.SetWindowIcon();

        Host = builder.Build();

        // Initialize database
        await InitializeDatabase();

        // Navigate to initial view
        await builder.NavigateAsync<Shell>();
    }

    /// <summary>
    /// Initializes the database context and applies migrations.
    /// </summary>
    private async Task InitializeDatabase()
    {
        try
        {
            using var scope = Host!.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.InitializeAsync();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Database initialization failed: {ex.Message}");
        }
    }

    /// <summary>
    /// Configures application services and dependencies.
    /// </summary>
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
            .ConfigureHttpClient(client => { client.BaseAddress = new Uri("http://10.0.2.2:5000"); });

        services.AddRefitClient<IProductApi>(new RefitSettings
            {
                ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                })
            })
            .ConfigureHttpClient(client => { client.BaseAddress = new Uri("http://10.0.2.2:5000"); });

        services.AddRefitClient<IOrderApi>(new RefitSettings
            {
                ContentSerializer = new SystemTextJsonContentSerializer(new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                })
            })
            .ConfigureHttpClient(client => { client.BaseAddress = new Uri("http://10.0.2.2:5000"); });

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

    /// <summary>
    /// Registers views and routes for navigation.
    /// </summary>
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
            new RouteMap("", View: views.FindByViewModel<LoginViewModel>(), IsDefault: true),
            new RouteMap("Login", View: views.FindByViewModel<LoginViewModel>()),
            new RouteMap("Home", View: views.FindByViewModel<HomeViewModel>()),
            new RouteMap("ProductDetail", View: views.FindByViewModel<ProductDetailViewModel>()),
            new RouteMap("Cart", View: views.FindByViewModel<CartViewModel>()),
            new RouteMap("OrderConfirmation", View: views.FindByViewModel<OrderConfirmationViewModel>())
        );
    }
}
