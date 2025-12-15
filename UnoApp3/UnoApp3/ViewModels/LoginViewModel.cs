using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;
using UnoApp3.Services;

namespace UnoApp3.ViewModels;

public partial class LoginViewModel : BaseViewModel
{
    private readonly AuthService _authService;

    [ObservableProperty]
    private string _username;

    [ObservableProperty]
    private string _password;

    [ObservableProperty]
    private bool _rememberMe;

    public LoginViewModel(INavigator navigator, AuthService authService) 
        : base(navigator)
    {
        _authService = authService;
        Title = "Đăng nhập";
    }

    [RelayCommand]
    private async Task Login()
    {
        IsBusy = true;
        
        try
        {
            // TODO: Uncomment when API is ready
            // var success = await _authService.LoginAsync(Username, Password, RememberMe);
            // if (success)
            // {
            //     await Navigator.NavigateRouteAsync("Main");
            // }
            // else
            // {
            //     // Show error message
            // }
            
            // For now, navigate directly without login
            // Fixed: Added 'this' as first parameter
            await Navigator.NavigateRouteAsync(this, "Main");
        }
        finally
        {
            IsBusy = false;
        }
    }
}
