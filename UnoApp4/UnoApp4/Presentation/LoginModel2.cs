using CommunityToolkit.Mvvm.Input;

namespace UnoApp4.Presentation;

public partial record LoginModel2
{
    private readonly IAuthenticationService _authService;
    private readonly INavigator _navigator;

    public LoginModel2(
        IAuthenticationService authService,
        INavigator navigator)
    {
        _authService = authService;
        _navigator = navigator;
    }

    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; }

    public IState<bool> IsBusy => State.Value(this, () => false);

    public ICommand LoginCommand => new AsyncRelayCommand(async () => await Login());

    public async ValueTask Login()
    {
        try
        {
            if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
            {
                this.Log().LogWarning("Login attempted with empty credentials");
                return;
            }

            this.Log().LogInformation("Login button clicked for user: {Username}", Username);

            var credentials = new Dictionary<string, string>
            {
                [nameof(Username)] = Username,
                [nameof(Password)] = Password,
                ["RememberMe"] = RememberMe.ToString()
            };

            var result = await _authService.LoginAsync(credentials);

            if (result)
            {
                this.Log().LogInformation("Login successful, navigating to Main page");
                await _navigator.NavigateViewModelAsync<MainModel>(this, qualifier: Qualifiers.ClearBackStack);
            }
            else
            {
                this.Log().LogWarning("Login failed for user: {Username}", Username);
                // TODO: Show error message to user
            }
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Error during login for user: {Username}", Username);
            // TODO: Show error message to user
        }
    }
}
