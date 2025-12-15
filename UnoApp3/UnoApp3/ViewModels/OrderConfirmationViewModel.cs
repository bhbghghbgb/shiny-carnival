using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;
using UnoApp3.Services;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.ViewModels;

public partial class OrderConfirmationViewModel : BaseViewModel
{
    private readonly OrderService _orderService;
    private readonly ICartRepository _cartRepository;
    private readonly ProductService _productService;

    [ObservableProperty] private string _orderId;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(OrderDateFormatted))]
    private DateTime _orderDate;

    public string OrderDateFormatted => $"{OrderDate:dd/MM/yyyy HH:mm}";

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(TotalAmountFormatted))]
    private decimal _totalAmount;

    public string TotalAmountFormatted => $"{TotalAmount:N0} đ";

    public OrderConfirmationViewModel(
        INavigator navigator,
        OrderService orderService,
        ICartRepository cartRepository,
        ProductService productService)
        : base(navigator)
    {
        _orderService = orderService;
        _cartRepository = cartRepository;
        _productService = productService;
        Title = "Xác nhận đơn hàng";

        // Set default values
        OrderDate = DateTime.Now;
        OrderId = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
    }

    [RelayCommand]
    private async Task ContinueShopping()
    {
        // Clear cart after order
        await _cartRepository.ClearCartAsync();

        // Navigate back to product list
        await Navigator.NavigateRouteAsync(this, "ProductList", qualifier: Qualifiers.ClearBackStack);
    }
}
