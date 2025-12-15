using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class ViewModelBase : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private string _title = string.Empty;

    protected readonly INavigator Navigator;

    public ViewModelBase(INavigator navigator)
    {
        Navigator = navigator;
    }

    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Navigator.GoBackAsync(this);
    }
}
