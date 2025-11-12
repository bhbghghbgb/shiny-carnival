using ProductApp.Models;

namespace ProductApp.Core.Services;

public interface IAuthService
{
    Task<bool> LoginAsync(string username, string password);
    Task<bool> IsAuthenticatedAsync();
    Task LogoutAsync();
    string? GetToken();
}

public class AuthService : IAuthService
{
    private readonly IAuthApi _authApi;
    private string? _token;

    public AuthService(IAuthApi authApi)
    {
        _authApi = authApi;
    }

    public async Task<bool> LoginAsync(string username, string password)
    {
        try
        {
            var request = new LoginRequest { Username = username, Password = password };
            var response = await _authApi.LoginAsync(request);
            _token = response.Token;
            return true;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Login failed: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> IsAuthenticatedAsync()
    {
        return !string.IsNullOrEmpty(_token);
    }

    public async Task LogoutAsync()
    {
        _token = null;
    }

    public string? GetToken()
    {
        return _token;
    }
}
