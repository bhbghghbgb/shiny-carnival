using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class OrderConfirmationViewModel : ViewModelBase
{
    [ObservableProperty]
    private OrderResponseDto? _order;

    [ObservableProperty]
    private string _orderNumber = string.Empty;

    [ObservableProperty]
    private decimal _totalAmount;

    public OrderConfirmationViewModel(INavigator navigator) 
        : base(navigator)
    {
        Title = "Order Confirmation";
    }

    public override Task OnNavigatedToAsync()
    {
        if (NavigationData is Dictionary<string, object> data && 
            data.TryGetValue("Order", out var orderObj) && 
            orderObj is OrderResponseDto order)
        {
            Order = order;
            OrderNumber = $"ORD-{order.Id:D6}";
            TotalAmount = order.FinalAmount;
        }

        return Task.CompletedTask;
    }

    [RelayCommand]
    private async Task GoToHomeAsync()
    {
        await Navigator.NavigateViewModelAsync<HomeViewModel>(this);
    }

    [RelayCommand]
    private async Task ViewOrderDetailsAsync()
    {
        // In a real app, you might navigate to an order details page
        // For now, just show a message
        System.Diagnostics.Debug.WriteLine($"Viewing order details for {OrderNumber}");
    }
}
