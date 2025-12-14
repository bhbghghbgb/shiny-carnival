using UnoApp4.Services.Api;
using UnoApp4.Models;

namespace UnoApp4.Services;

public class AuthService(IAuthApi authApi)
{
    private string? _token;
    private string? _refreshToken;

    public async Task<LoginResponse?> LoginAsync(string username, string password, bool rememberMe)
    {
        try
        {
            this.Log().LogInformation("Attempting login for user: {Username}", username);

            var request = new LoginRequest
            {
                Username = username,
                Password = password
            };

            var response = await authApi.Login(request);

            if (response?.Data != null)
            {
                _token = response.Data.Token;
                _refreshToken = response.Data.RefreshToken;

                this.Log().LogInformation("Login successful for user: {Username}", username);

                // TODO: Save token and user info to secure storage if rememberMe is true
                if (rememberMe)
                {
                    this.Log().LogDebug("Remember me enabled - tokens should be persisted");
                }

                return response.Data;
            }

            this.Log().LogWarning("Login failed - no data returned from API");
            return null;
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Login failed for user: {Username}", username);
            return null;
        }
    }

    public async Task<RefreshTokenResponse?> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            this.Log().LogInformation("Attempting to refresh token");

            var request = new RefreshTokenRequest
            {
                RefreshToken = refreshToken
            };

            var response = await authApi.RefreshToken(request);

            if (response?.Data != null)
            {
                _token = response.Data.Token;
                // Note: Refresh token stays the same

                this.Log().LogInformation("Token refresh successful");
                return response.Data;
            }

            this.Log().LogWarning("Token refresh failed - no data returned from API");
            return null;
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Token refresh failed");
            return null;
        }
    }

    public async Task<bool> LogoutAsync()
    {
        try
        {
            if (string.IsNullOrEmpty(_refreshToken))
            {
                this.Log().LogWarning("Logout attempted but no refresh token available");
                return false;
            }

            this.Log().LogInformation("Attempting logout");

            var request = new LogoutRequest
            {
                RefreshToken = _refreshToken
            };

            var response = await authApi.Logout(request);

            if (response?.Success == true)
            {
                _token = null;
                _refreshToken = null;

                this.Log().LogInformation("Logout successful");
                return true;
            }

            this.Log().LogWarning("Logout failed");
            return false;
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Logout failed");

            // Clear tokens anyway on error
            _token = null;
            _refreshToken = null;

            return false;
        }
    }

    public string? GetToken() => _token;

    public string? GetRefreshToken() => _refreshToken;

    public void SetTokens(string token, string refreshToken)
    {
        _token = token;
        _refreshToken = refreshToken;
        this.Log().LogDebug("Tokens set programmatically");
    }

    public void ClearTokens()
    {
        _token = null;
        _refreshToken = null;
        this.Log().LogDebug("Tokens cleared");
    }
}
