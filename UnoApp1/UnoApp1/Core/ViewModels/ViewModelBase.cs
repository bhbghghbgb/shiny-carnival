using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;

namespace UnoApp1.Core.ViewModels;

public partial class ViewModelBase : ObservableObject
{
    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = string.Empty;

    protected INavigator Navigator { get; }

    // Add this property for navigation data
    protected object? NavigationData { get; private set; }

    public ViewModelBase(INavigator navigator)
    {
        Navigator = navigator;
    }

    // Add this method to handle navigation
    public virtual Task OnNavigatedFromAsync(NavigationMode mode)
    {
        return Task.CompletedTask;
    }

    // Add this method to handle navigation with data
    public virtual Task OnNavigatedToAsync(object? parameter)
    {
        NavigationData = parameter;
        return Task.CompletedTask;
    }

    [RelayCommand]
    private async Task NavigateBackAsync()
    {
        await Navigator.NavigateBackAsync(this);
    }
}
