using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class HomeViewModel : ViewModelBase
{
    [ObservableProperty]
    private ProductListViewModel _productListViewModel;

    public HomeViewModel(INavigator navigator, ProductListViewModel productListViewModel) 
        : base(navigator)
    {
        _productListViewModel = productListViewModel;
        Title = "Retail Store";
    }

    [RelayCommand]
    private async Task ViewCartAsync()
    {
        await Navigator.NavigateViewModelAsync<CartViewModel>(this);
    }

    [RelayCommand]
    private async Task LogoutAsync()
    {
        // In a real app, you'd call AuthService.Logout()
        await Navigator.NavigateViewModelAsync<LoginViewModel>(this);
    }
}
