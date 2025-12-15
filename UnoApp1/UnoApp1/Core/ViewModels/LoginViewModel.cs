using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Core.Common;
using UnoApp1.Core.Services;

namespace UnoApp1.Core.ViewModels;

public partial class LoginViewModel : ObservableObject, ILoadableViewModel, INavigableViewModel
{
    private readonly IAuthService _authService;
    private readonly INavigationService _navigationService;

    [ObservableProperty] private string _username = string.Empty;

    [ObservableProperty] private string _password = string.Empty;

    [ObservableProperty] private string _errorMessage = string.Empty;

    [ObservableProperty] private bool _showError;

    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = "Login";

    public LoginViewModel(IAuthService authService, INavigationService navigationService)
    {
        _authService = authService;
        _navigationService = navigationService;
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
                await _navigationService.NavigateToHomeAsync();
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

    public Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null) => Task.CompletedTask;
    public Task OnNavigatedFromAsync() => Task.CompletedTask;
}
