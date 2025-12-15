namespace UnoApp3.Presentation;

public partial class MainScaffoldViewModel : ObservableObject
{
    private IAuthenticationService _authentication;

    private INavigator _navigator;

    [ObservableProperty] private string? name;

    public MainScaffoldViewModel(
        IStringLocalizer localizer,
        IOptions<AppConfig> appInfo,
        IAuthenticationService authentication,
        INavigator navigator)
    {
        _navigator = navigator;
        _authentication = authentication;
        Title = "Main";
        Title += $" - {localizer["ApplicationName"]}";
        Title += $" - {appInfo?.Value?.Environment}";
        GoToSecond = new AsyncRelayCommand(GoToSecondView);
        Logout = new AsyncRelayCommand(DoLogout);
    }

    public string? Title { get; }

    public ICommand GoToSecond { get; }

    public ICommand Logout { get; }

    private async Task GoToSecondView()
    {
        await _navigator.NavigateViewModelAsync<SecondScaffoldViewModel>(this, data: new Entity(Name!));
    }

    public async Task DoLogout(CancellationToken token)
    {
        await _authentication.LogoutAsync(token);
    }
}
