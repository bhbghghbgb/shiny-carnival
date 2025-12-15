using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Core.Common;
using UnoApp1.Core.Services;

namespace UnoApp1.Core.ViewModels;

public partial class HomeViewModel : ObservableObject, ILoadableViewModel, INavigableViewModel
{
    private readonly INavigationService _navigationService;

    [ObservableProperty] private ProductListViewModel _productListViewModel;

    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = "Retail Store";

    public HomeViewModel(INavigationService navigationService, ProductListViewModel productListViewModel)
    {
        _navigationService = navigationService;
        _productListViewModel = productListViewModel;
    }

    [RelayCommand]
    private async Task ViewCartAsync()
    {
        await _navigationService.NavigateToCartAsync();
    }

    [RelayCommand]
    private async Task LogoutAsync()
    {
        await _navigationService.NavigateToLoginAsync();
    }

    public Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null) => Task.CompletedTask;
    public Task OnNavigatedFromAsync() => Task.CompletedTask;
}
