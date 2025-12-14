namespace UnoApp4.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResult> LoginAsync(string username, string password, bool rememberMe = false);
    Task<RefreshTokenResult> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync();
    Task<UserDto> GetCurrentUserAsync();
    string GetAccessToken();
    string GetRefreshToken();
    UserDto GetCurrentUser();
    bool IsAuthenticated();
    Task<bool> TryLoadStoredTokensAsync();
    Task ClearTemporaryTokensAsync();
}
