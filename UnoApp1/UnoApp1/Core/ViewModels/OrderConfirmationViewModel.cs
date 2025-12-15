using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Core.Common;
using UnoApp1.Core.Services;
using UnoApp1.Models;

namespace UnoApp1.Core.ViewModels;

public partial class OrderConfirmationViewModel : ObservableObject, ILoadableViewModel, INavigableViewModel
{
    private readonly INavigationService _navigationService;
    private readonly IOrderService _orderService;

    [ObservableProperty] private OrderResponseDto? _order;

    [ObservableProperty] private string _orderNumber = string.Empty;

    [ObservableProperty] private decimal _totalAmount;

    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = "Order Confirmation";

    public OrderConfirmationViewModel(INavigationService navigationService, IOrderService orderService)
    {
        _navigationService = navigationService;
        _orderService = orderService;
    }

    public async Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null)
    {
        await LoadOrderConfirmationAsync();
    }

    public Task OnNavigatedFromAsync() => Task.CompletedTask;

    [RelayCommand]
    private async Task LoadOrderConfirmationAsync()
    {
        IsBusy = true;

        try
        {
            // In a real app, you might receive an order ID from navigation
            // For now, we'll simulate a successful order creation
            // The actual order was created in CartViewModel.ConfirmPurchaseAsync()

            // Create a mock order response for confirmation
            _order = new OrderResponseDto
            {
                Id = new Random().Next(1000, 9999),
                CustomerName = "Customer",
                TotalAmount = 0, // This would come from the actual order
                FinalAmount = 0,
                OrderDate = DateTime.Now
            };

            OrderNumber = $"ORD-{_order.Id:D6}";
            TotalAmount = _order.FinalAmount;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load order confirmation: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task GoToHomeAsync()
    {
        await _navigationService.NavigateToHomeAsync();
    }

    [RelayCommand]
    private async Task ViewOrderDetailsAsync()
    {
        // In a real app, navigate to order details
        System.Diagnostics.Debug.WriteLine($"Viewing order details for {OrderNumber}");
    }
}
