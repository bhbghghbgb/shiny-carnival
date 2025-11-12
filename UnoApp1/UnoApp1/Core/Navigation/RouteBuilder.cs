namespace UnoApp1.Core.Navigation;

public static class Routes
{
    public const string Login = "Login";
    public const string Home = "Home";
    public const string ProductDetail = "ProductDetail";
    public const string Cart = "Cart";
    public const string OrderConfirmation = "OrderConfirmation";
}

public static class RouteBuilder
{
    public static string BuildProductDetailRoute(int productId)
        => $"{Routes.ProductDetail}?productId={productId}";

    public static string BuildOrderConfirmationRoute(int orderId)
        => $"{Routes.OrderConfirmation}?orderId={orderId}";
}
