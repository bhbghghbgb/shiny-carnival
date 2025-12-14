using UnoApp4.Helpers.Converters;
using UnoApp4.Services;
using UnoApp4.Services.Api;
using UnoApp4.Services.Repositories;
using UnoApp4.Services.Interfaces;

namespace UnoApp4;

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
                    // Register AuthHeaderHandler for adding bearer tokens
                    services.AddTransient<AuthHeaderHandler>();

                    // API Clients with Refit using Uno.Extensions
                    // These read from appsettings.json endpoints
                    services.AddRefitClient<IAuthApi>(context, name: "AuthEndpoint");
                    services.AddRefitClient<IProductApi>(context, name: "ProductEndpoint",
                        configure: (builder, options) =>
                            builder.ConfigureHttpClient(client =>
                            {
                                // Configure the HttpClient here
                            }).AddHttpMessageHandler<AuthHeaderHandler>()
                    );
                    services.AddRefitClient<IOrderApi>(context, name: "OrderEndpoint",
                        configure: (builder, options) =>
                            builder.ConfigureHttpClient(client =>
                            {
                                // Configure the HttpClient here
                            }).AddHttpMessageHandler<AuthHeaderHandler>()
                    );
                })
                .UseAuthentication(auth =>
                    auth.AddCustom(custom =>
                        custom
                            .Login(async (sp, dispatcher, credentials, cancellationToken) =>
                            {
                                // Process credentials that are passed into the LoginAsync method
                                // Return null to fail the LoginAsync method
                                if (credentials == null ||
                                    !credentials.TryGetValue(nameof(LoginModel.Username), out var username) ||
                                    string.IsNullOrEmpty(username) ||
                                    !credentials.TryGetValue(nameof(LoginModel.Password), out var password) ||
                                    string.IsNullOrEmpty(password))
                                {
                                    return null;
                                }

                                var authService = sp.GetRequiredService<AuthService>();
                                var rememberMe = credentials.TryGetValue("RememberMe", out var rememberMeStr) &&
                                                 bool.TryParse(rememberMeStr, out var remember) && remember;

                                var result = await authService.LoginAsync(username, password, rememberMe);

                                if (result == null)
                                {
                                    return null;
                                }

                                // Return IDictionary containing tokens used by service calls or in the app
                                var tokens = new Dictionary<string, string>
                                {
                                    [TokenCacheExtensions.AccessTokenKey] = result.Token,
                                    [TokenCacheExtensions.RefreshTokenKey] = result.RefreshToken,
                                    ["UserId"] = result.User.Id.ToString(),
                                    ["Username"] = result.User.Username,
                                    ["FullName"] = result.User.FullName,
                                    ["Role"] = result.User.Role.ToString()
                                };
                                return tokens;
                            })
                            .Refresh(async (sp, tokenDictionary, cancellationToken) =>
                            {
                                // Refresh tokens using the currently stored refresh token
                                // Return null to fail the Refresh method
                                if (tokenDictionary == null ||
                                    !tokenDictionary.TryGetValue(TokenCacheExtensions.RefreshTokenKey,
                                        out var refreshToken) ||
                                    string.IsNullOrEmpty(refreshToken))
                                {
                                    return null;
                                }

                                var authService = sp.GetRequiredService<AuthService>();
                                var result = await authService.RefreshTokenAsync(refreshToken);

                                if (result == null)
                                {
                                    return null;
                                }

                                // Return IDictionary containing refreshed tokens
                                tokenDictionary[TokenCacheExtensions.AccessTokenKey] = result.Token;
                                tokenDictionary["UserId"] = result.User.Id.ToString();
                                tokenDictionary["Username"] = result.User.Username;
                                tokenDictionary["FullName"] = result.User.FullName;
                                tokenDictionary["Role"] = result.User.Role.ToString();
                                return tokenDictionary;
                            })
                            .Logout(async (sp, cancellationToken) =>
                            {
                                var authService = sp.GetRequiredService<AuthService>();
                                await authService.LogoutAsync();
                                return true;
                            }), name: "CustomAuth")
                )
                .ConfigureServices((context, services) =>
                {
                    // TODO: Register your services
                    //services.AddSingleton<IMyService, MyService>();
                    ConfigureAppServices(services, context);
                })
                .UseNavigation(ReactiveViewModelMappings.ViewModelMappings, RegisterRoutes)
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
            this.Log().LogInformation("Database initializing");
            await InitializeDatabaseAsync(services);
            this.Log().LogInformation("Database initialized");

            var auth = services.GetRequiredService<IAuthenticationService>();
            var authenticated = await auth.RefreshAsync();
            if (authenticated)
            {
                this.Log().LogInformation("User authenticated, navigating to Main page");
                await navigator.NavigateViewModelAsync<MainModel>(this, qualifier: Qualifiers.Nested);
            }
            else
            {
                this.Log().LogInformation("User not authenticated, navigating to Login page");
                // await navigator.NavigateViewModelAsync<LoginModel>(this, qualifier: Qualifiers.Nested);
                await navigator.NavigateViewModelAsync<LoginModel2>(this, qualifier: Qualifiers.Nested);
            }
        });
        this.Log().LogInformation("Navigation completed");
    }

    /// <summary>
    /// Register navigation routes
    /// </summary>
    private static void RegisterRoutes(IViewRegistry views, IRouteRegistry routes)
    {
        views.Register(
            new ViewMap(ViewModel: typeof(ShellModel)),
            new ViewMap<LoginPage2, LoginModel2>(),
            new ViewMap<MainPage, MainModel>()
            // new ViewMap<ProductListPage, ProductListModel>(),
            // new DataViewMap<ProductDetailPage, ProductDetailModel, ProductDetailModelData>(),
            // new ViewMap<CartPage, CartModel>(),
            // new ViewMap<OrderConfirmationPage, OrderConfirmationModel>()
        );

        routes.Register(
            new RouteMap("", View: views.FindByViewModel<ShellModel>(),
                Nested:
                [
                    new RouteMap("Login", View: views.FindByViewModel<LoginModel2>()),
                    new RouteMap("Main", View: views.FindByViewModel<MainModel>(), IsDefault: true)
                    // Nested:
                    // [
                    //     // new RouteMap("ProductList", View: views.FindByViewModel<ProductListModel>(),
                    //     //     IsDefault: true),
                    //     // new RouteMap("ProductDetail", View: views.FindByViewModel<ProductDetailModel>()),
                    //     // new RouteMap("Cart", View: views.FindByViewModel<CartModel>()),
                    //     // new RouteMap("OrderConfirmation", View: views.FindByViewModel<OrderConfirmationModel>()),
                    // ]),
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

        // Configure ImageUrlConverter
        var imageEndpoint = context.Configuration.GetSection("ImageEndpoint")["Url"];
        // Assuming you have a static property for this
        ProductImageUrlConverter.BaseImageUrl =
            !string.IsNullOrEmpty(imageEndpoint) ? imageEndpoint : "http://localhost";
    }
}
