using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
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
        await Navigator.GoBackAsync();
    }
}
