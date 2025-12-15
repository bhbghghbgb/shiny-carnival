using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;

namespace UnoApp3.ViewModels;

public partial class MainViewModel : BaseViewModel
{
    public MainViewModel(INavigator navigator) : base(navigator)
    {
        Title = "Trang chủ";
    }

    [RelayCommand]
    private async Task GoToProducts()
    {
        await Navigator.NavigateRouteAsync(this, "ProductList");
    }

    [RelayCommand]
    private async Task GoToCart()
    {
        await Navigator.NavigateRouteAsync(this, "Cart");
    }
}
