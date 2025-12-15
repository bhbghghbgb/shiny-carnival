using UnoApp3.Data;
using UnoApp3.Helpers.Converters;
using UnoApp3.Services;
using UnoApp3.Services.Api;
using UnoApp3.Services.Interfaces;
using UnoApp3.Services.Repositories;
using UnoApp3.ViewModels;
using UnoApp3.Views;

namespace UnoApp3;

public partial class App : Application
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

    protected async override void OnLaunched(LaunchActivatedEventArgs args)
    {
        var builder = this.CreateBuilder(args)
            // Add navigation support for toolkit controls such as TabBar and NavigationView
            .UseToolkitNavigation()
            .Configure(host => host
#if DEBUG
                // Switch to Development environment when running in DEBUG
                .UseEnvironment(Environments.Development)
#endif
                .UseLogging(configure: (context, logBuilder) =>
                {
                    // Configure log levels for different categories of logging
                    logBuilder
                        .SetMinimumLevel(
                            // context.HostingEnvironment.IsDevelopment() ? LogLevel.Information : LogLevel.Warning)
                            context.HostingEnvironment.IsDevelopment() ? LogLevel.Debug : LogLevel.Information)

                        // Default filters for core Uno Platform namespaces
                        // .CoreLogLevel(LogLevel.Warning);
                        .CoreLogLevel(LogLevel.Information);

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
                .UseConfiguration(configure: configBuilder =>
                    configBuilder
                        .EmbeddedSource<App>()
                        .Section<AppConfig>()
                )
                // Enable localization (see appsettings.json for supported languages)
                .UseLocalization()
                .UseHttp((context, services) =>
                {
#if DEBUG
                    // DelegatingHandler will be automatically injected
                    services.AddTransient<DelegatingHandler, DebugHttpHandler>();
#endif
                    // API Clients with Refit using Uno.Extensions
                    // These read from appsettings.json endpoints
                    services.AddRefitClient<IAuthApi>(context, name: "AuthEndpoint");
                    services.AddRefitClient<IProductApi>(context, name: "ProductEndpoint");
                    services.AddRefitClient<IOrderApi>(context, name: "OrderEndpoint");
                })
                .UseAuthentication(auth =>
                    auth.AddWeb(name: "WebAuthentication")
                )
                .ConfigureServices((context, services) =>
                {
                    // TODO: Register your services
                    //services.AddSingleton<IMyService, MyService>();
                    ConfigureAppServices(services, context);
                })
                .UseNavigation(RegisterRoutes)
            );
        MainWindow = builder.Window;

#if DEBUG
        MainWindow.UseStudio();
#endif
        MainWindow.SetWindowIcon();

        Host = await builder.NavigateAsync<Shell>
        (initialNavigate: async (services, navigator) =>
        {
            // Initialize database before any navigation
            this.Log().LogInformation("Database initialzing");
            await InitializeDatabaseAsync(services);
            this.Log().LogInformation("Database initialized");

            // var auth = services.GetRequiredService<IAuthenticationService>();
            // var authenticated = await auth.RefreshAsync();
            // if (authenticated)
            // {
            //     await navigator.NavigateViewModelAsync<MainScaffoldViewModel>(this, qualifier: Qualifiers.Nested);
            // }
            // else
            // {
            //     await navigator.NavigateViewModelAsync<LoginScaffoldViewModel>(this, qualifier: Qualifiers.Nested);
            // }

            await navigator.NavigateViewModelAsync<LoginViewModel>(this, qualifier: Qualifiers.Nested);
            this.Log().LogInformation("Navigated to login page");
        });
        this.Log().LogInformation("Navigated Async");
    }

    /// <summary>
    /// Register navigation routes
    /// </summary>
    private static void RegisterRoutes(IViewRegistry views, IRouteRegistry routes)
    {
        // views.Register(
        //     new ViewMap(ViewModel: typeof(ShellViewModel)),
        //     new ViewMap<LoginScaffoldPage, LoginScaffoldViewModel>(),
        //     new ViewMap<MainScaffoldPage, MainScaffoldViewModel>(),
        //     new DataViewMap<SecondScaffoldPage, SecondScaffoldViewModel, Entity>()
        // );
        //
        // routes.Register(
        //     new RouteMap("", View: views.FindByViewModel<ShellViewModel>(),
        //         Nested:
        //         [
        //             new("Login", View: views.FindByViewModel<LoginScaffoldViewModel>()),
        //             new("Main", View: views.FindByViewModel<MainScaffoldViewModel>(), IsDefault: true),
        //             new("Second", View: views.FindByViewModel<SecondScaffoldViewModel>()),
        //         ]
        //     )
        // );

        views.Register(
            new ViewMap(ViewModel: typeof(ShellViewModel)),
            new ViewMap<LoginPage, LoginViewModel>(),
            new ViewMap<MainPage, MainViewModel>(),
            new ViewMap<ProductListPage, ProductListViewModel>(),
            new DataViewMap<ProductDetailPage, ProductDetailViewModel, ProductDetailViewModelData>(),
            new ViewMap<CartPage, CartViewModel>(),
            new ViewMap<OrderConfirmationPage, OrderConfirmationViewModel>()
        );

        routes.Register(
            new RouteMap("", View: views.FindByViewModel<ShellViewModel>(),
                Nested:
                [
                    new("Login", View: views.FindByViewModel<LoginViewModel>(), IsDefault: true),
                    new("Main", View: views.FindByViewModel<MainViewModel>(),
                        Nested:
                        [
                            new("ProductList", View: views.FindByViewModel<ProductListViewModel>(), IsDefault: true),
                            new("ProductDetail", View: views.FindByViewModel<ProductDetailViewModel>()),
                            new("Cart", View: views.FindByViewModel<CartViewModel>()),
                            new("OrderConfirmation", View: views.FindByViewModel<OrderConfirmationViewModel>()),
                        ]),
                ]
            )
        );
    }

    /// <summary>
    /// Initialize the database (create tables if needed)
    /// </summary>
    private static async Task InitializeDatabaseAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Use async version if available in your EF Core version
        await Task.Run(() => dbContext.Database.EnsureCreated());
    }

    /// <summary>
    /// Configure application-specific services
    /// </summary>
    private static void ConfigureAppServices(IServiceCollection services, HostBuilderContext context)
    {
        // Database
        services.AddDbContext<AppDbContext>();

        // Repositories
        services.AddScoped<ICartRepository, CartRepository>();

        // Services
        services.AddScoped<AuthService>();
        services.AddScoped<ProductService>();
        services.AddScoped<OrderService>();

        // ViewModels
        services.AddTransient<LoginViewModel>();
        services.AddTransient<ProductListViewModel>();
        services.AddTransient<CartViewModel>();
        // Add other ViewModels...

        // Configure ImageUrlConverter
        var imageEndpoint = context.Configuration.GetSection("ImageEndpoint")["Url"];
        // Assuming you have a static property for this
        ProductImageUrlConverter.BaseImageUrl =
            !string.IsNullOrEmpty(imageEndpoint) ? imageEndpoint : "http://10.0.0.2";
        
        services.AddMemoryCache();
    }
}
