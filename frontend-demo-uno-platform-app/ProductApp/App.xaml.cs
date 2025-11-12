using Microsoft.Extensions.Logging;
using ProductApp.Services;
using ProductApp.ViewModels;
using ProductApp.Views;

namespace ProductApp;

public sealed partial class App : Application
{
    private Window? _window;
    private IHost? _host;

    public App()
    {
        InitializeComponent();
    }

    protected async override void OnLaunched(LaunchActivatedEventArgs args)
    {
        var appBuilder = this.CreateBuilder(args)
            .Configure(hostBuilder =>
            {
                hostBuilder
                    .UseLogging(configure: (context, logBuilder) =>
                    {
                        logBuilder.SetMinimumLevel(LogLevel.Information);
                    })
                    .UseConfiguration(configure: configBuilder =>
                    {
                        configBuilder.EmbeddedSource<App>();
                    })
                    .ConfigureServices((context, services) =>
                    {
                        // Register ViewModels and Services
                        services.AddTransient<LoginViewModel>();
                        services.AddTransient<HomeViewModel>();
                        services.AddTransient<ProductDetailViewModel>();
                        services.AddTransient<CartViewModel>();

                        services.AddTransient<IAuthService, AuthService>();
                        services.AddTransient<IProductsService, ProductsService>();
                        services.AddTransient<ICartRepository, CartRepository>();

                        // Register Refit Clients (Interfaces will be created in Task 2)
                        // services.AddRefitClient<IAuthApi>()...
                        // services.AddRefitClient<IProductsApi>()...

                    })
                    .UseNavigation(RegisterRoutes);
            });

        _host = appBuilder.Build();
        _window = _host.Services.GetRequiredService<Window>();
        _window.Activate();
    }

    private static void RegisterRoutes(IViewRegistry views, IRouteRegistry routes)
    {
        // Routes will be registered in Task 4
        /*
        views.Register(
            new ViewMap(ViewModel: typeof(LoginViewModel)),
            new ViewMap<LoginPage, LoginViewModel>(),
            new ViewMap<HomePage, HomeViewModel>(),
            new ViewMap<ProductDetailPage, ProductDetailViewModel>(),
            new ViewMap<CartPage, CartViewModel>()
        );

        routes.Register(
            new RouteMap("", View: views.FindByViewModel<LoginViewModel>()),
            new RouteMap("Login", View: views.FindByViewModel<LoginViewModel>()),
            new RouteMap("Home", View: views.FindByViewModel<HomeViewModel>()),
            new RouteMap("ProductDetail", View: views.FindByViewModel<ProductDetailViewModel>()),
            new RouteMap("Cart", View: views.FindByViewModel<CartViewModel>())
        );
        */
    }
}
