using CommunityToolkit.Mvvm.Input;

namespace UnoApp4.Presentation;

public partial record Login2Model(
    IAuthenticationService AuthService,
    INavigator Navigator)
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; }

    public IState<bool> IsBusy => State.Value(this, () => false);
    public IState<string> ErrorMessage => State.Value(this, () => "");
    public IState<bool> ShowSuccessDialog => State.Value(this, () => false);

    public IFeed<string> IsBusyStr => IsBusy.Select(b => $"IsBusy: {b}");

    public ICommand LoginCommand => new AsyncRelayCommand(async () => await Login());

    public async ValueTask Login(CancellationToken ct = default)
    {
        await IsBusy.Set(true, ct);
        await ErrorMessage.Set("", ct); // Clear previous errors
        try
        {
            if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
            {
                this.Log().LogWarning("Login attempted with empty credentials");
                await ErrorMessage.Set("Vui lòng nhập tên đăng nhập và mật khẩu", ct);
                return;
            }

            this.Log().LogInformation("Login button clicked for user: {Username}", Username);

            var credentials = new Dictionary<string, string>
            {
                [nameof(Username)] = Username,
                [nameof(Password)] = Password,
                ["RememberMe"] = RememberMe.ToString()
            };

            var result = await AuthService.LoginAsync(credentials);

            if (result)
            {
                this.Log().LogInformation("Login successful - showing success dialog");
                await ShowSuccessDialog.Set(true, ct); // Show dialog INSTEAD of navigating
                // await _navigator.NavigateViewModelAsync<MainModel>(this, qualifier: Qualifiers.ClearBackStack);
            }
            else
            {
                this.Log().LogWarning("Login failed for user: {Username}", Username);
                await ErrorMessage.Set("Tên đăng nhập hoặc mật khẩu không đúng", ct);
            }
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Error during login for user: {Username}", Username);
            await ErrorMessage.Set("Lỗi kết nối. Vui lòng thử lại.", ct);
        }
        finally
        {
            await IsBusy.Set(false, ct);
        }
    }

    public async ValueTask OnSuccessDialogPrimary(CancellationToken ct = default)
    {
        await ShowSuccessDialog.Set(false, ct);
        await Navigator.NavigateViewModelAsync<MainModel>(this, qualifier: Qualifiers.ClearBackStack);
    }

    public async ValueTask OnSuccessDialogClose(CancellationToken ct = default)
    {
        await ShowSuccessDialog.Set(false, ct);
    }
}
