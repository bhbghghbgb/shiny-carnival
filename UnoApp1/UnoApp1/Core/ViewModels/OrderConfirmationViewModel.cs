using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Models;
using Uno.Extensions.Navigation;

namespace UnoApp1.Core.ViewModels;

public partial class OrderConfirmationViewModel : ViewModelBase
{
    [ObservableProperty] private OrderResponseDto? _order;

    [ObservableProperty] private string _orderNumber = string.Empty;

    [ObservableProperty] private decimal _totalAmount;

    public OrderConfirmationViewModel(INavigator navigator)
        : base(navigator)
    {
        Title = "Order Confirmation";
    }

    // Fixed method signature
    public override async Task OnNavigatedToAsync(object? parameter)
    {
        await base.OnNavigatedToAsync(parameter);

        if (NavigationData is Dictionary<string, object> data &&
            data.TryGetValue("Order", out var orderObj) &&
            orderObj is OrderResponseDto order)
        {
            Order = order;
            OrderNumber = $"ORD-{order.Id:D6}";
            TotalAmount = order.FinalAmount;
        }
    }

    [RelayCommand]
    private async Task GoToHomeAsync()
    {
        await Navigator.NavigateViewModelAsync<HomeViewModel>(this);
    }

    [RelayCommand]
    private async Task ViewOrderDetailsAsync()
    {
        System.Diagnostics.Debug.WriteLine($"Viewing order details for {OrderNumber}");
    }
}
