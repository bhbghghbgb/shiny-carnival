namespace UnoApp1.Core.Navigation;

public static class NavigationParameters
{
    public const string ProductId = "productId";
    public const string OrderId = "orderId";
}

public record ProductDetailParameters(int ProductId);
public record OrderConfirmationParameters(int OrderId);