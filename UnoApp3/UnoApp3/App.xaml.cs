using Uno.Resizetizer;
using UnoApp3.Data;
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
        // Ensure database is created
        using (var scope = Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.EnsureCreated();
        }
        
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
                })
                .UseAuthentication(auth =>
                    auth.AddWeb(name: "WebAuthentication")
                )
                .ConfigureServices((context, services) =>
                {
                    // TODO: Register your services
                    //services.AddSingleton<IMyService, MyService>();
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
            var auth = services.GetRequiredService<IAuthenticationService>();
            var authenticated = await auth.RefreshAsync();
            if (authenticated)
            {
                await navigator.NavigateViewModelAsync<MainScaffoldViewModel>(this, qualifier: Qualifiers.Nested);
            }
            else
            {
                await navigator.NavigateViewModelAsync<LoginScaffoldViewModel>(this, qualifier: Qualifiers.Nested);
            }
        });
    }

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
            new ViewMap<CartPage, CartViewModel>(),
            new ViewMap<OrderConfirmationPage, OrderConfirmationViewModel>()
        );

        routes.Register(
            new RouteMap("", View: views.FindByViewModel<ShellViewModel>(),
                Nested:
                [
                    new("Login", View: views.FindByViewModel<LoginViewModel>()),
                    new("Main", View: views.FindByViewModel<MainViewModel>(), 
                        Nested: 
                        [
                            new("ProductList", View: views.FindByViewModel<ProductListViewModel>(), IsDefault: true),
                            new("Cart", View: views.FindByViewModel<CartViewModel>()),
                            new("OrderConfirmation", View: views.FindByViewModel<OrderConfirmationViewModel>()),
                        ]),
                ]
            )
        );
    }
    
    private static void ConfigureServices(IServiceCollection services)
    {
        // Database
        services.AddDbContext<AppDbContext>();
    
        // Repositories
        services.AddScoped<ICartRepository, CartRepository>();
    
        // Services
        services.AddScoped<AuthService>();
        services.AddScoped<ProductService>();
        services.AddScoped<OrderService>();
    
        // API Clients with Refit
        var apiBaseUrl = "http://your-api-base-url"; // TODO: Move to configuration
    
        services.AddRefitClient<IAuthApi>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiBaseUrl));
        // TODO: Add authorization handler here
        
        services.AddRefitClient<IProductApi>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiBaseUrl));
        
        services.AddRefitClient<IOrderApi>()
            .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiBaseUrl));
    
        // ViewModels
        services.AddTransient<LoginViewModel>();
        services.AddTransient<ProductListViewModel>();
        services.AddTransient<CartViewModel>();
        // Add other ViewModels...
    }

}
