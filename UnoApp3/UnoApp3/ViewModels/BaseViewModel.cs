using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.UI.Dispatching;
using Uno.Extensions.Navigation;

namespace UnoApp3.ViewModels;

public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private string _title;

    protected INavigator Navigator { get; }
    
    public BaseViewModel(INavigator navigator)
    {
        Navigator = navigator;
    }

    [RelayCommand]
    private async Task GoBack()
    {
        // Changed: Use NavigateBackAsync() instead of GoBackAsync()
        await Navigator.NavigateBackAsync(this);
    }
    
    // Virtual method for navigation lifecycle
    // Override this in derived ViewModels to handle navigation parameters
    public virtual Task OnNavigatedTo(IReadOnlyDictionary<string, object>? data = null)
    {
        return Task.CompletedTask;
    }

    // Optional: Handle navigation from
    public virtual Task OnNavigatedFrom()
    {
        return Task.CompletedTask;
    }
}
