using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class LoginViewModel : ViewModelBase
{
    private readonly IAuthService _authService;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string _username = string.Empty;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string _password = string.Empty;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [ObservableProperty]
    private bool _showError;

    public LoginViewModel(INavigator navigator, IAuthService authService) 
        : base(navigator)
    {
        _authService = authService;
        Title = "Login";
    }

    private bool CanLogin => !string.IsNullOrWhiteSpace(Username) && 
                           !string.IsNullOrWhiteSpace(Password) && 
                           !IsBusy;

    [RelayCommand(CanExecute = nameof(CanLogin))]
    private async Task LoginAsync()
    {
        IsBusy = true;
        ShowError = false;
        ErrorMessage = string.Empty;

        try
        {
            var success = await _authService.LoginAsync(Username, Password);
            
            if (success)
            {
                await Navigator.NavigateViewModelAsync<HomeViewModel>(this);
            }
            else
            {
                ErrorMessage = "Invalid username or password";
                ShowError = true;
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Login failed: {ex.Message}";
            ShowError = true;
        }
        finally
        {
            IsBusy = false;
        }
    }

    protected override void OnPropertyChanged(System.ComponentModel.PropertyChangedEventArgs e)
    {
        base.OnPropertyChanged(e);
        
        if (e.PropertyName == nameof(Username) || 
            e.PropertyName == nameof(Password) || 
            e.PropertyName == nameof(IsBusy))
        {
            LoginCommand.NotifyCanExecuteChanged();
        }
    }
}
