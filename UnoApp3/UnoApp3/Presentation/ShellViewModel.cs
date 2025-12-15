namespace UnoApp3.Presentation;

public class ShellViewModel
{
    private readonly IAuthenticationService _authentication;


    private readonly INavigator _navigator;

    public ShellViewModel(
        IAuthenticationService authentication,
        INavigator navigator)
    {
        _navigator = navigator;
        _authentication = authentication;
        _authentication.LoggedOut += LoggedOut;
    }

    private async void LoggedOut(object? sender, EventArgs e)
    {
        await _navigator.NavigateViewModelAsync<LoginScaffoldViewModel>(this, qualifier: Qualifiers.ClearBackStack);
    }
}