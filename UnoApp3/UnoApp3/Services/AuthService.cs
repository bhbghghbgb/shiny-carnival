using UnoApp3.Models.Auth;
using UnoApp3.Services.Api;

namespace UnoApp3.Services;

public class AuthService
{
    private readonly IAuthApi _authApi;
    
    // TODO: Implement token storage
    private string _token;

    public AuthService(IAuthApi authApi)
    {
        _authApi = authApi;
    }

    public async Task<bool> LoginAsync(string username, string password, bool rememberMe)
    {
        try
        {
            var request = new LoginRequest
            {
                Username = username,
                Password = password
            };
            
            var response = await _authApi.Login(request);
            
            if (response?.Data != null)
            {
                _token = response.Data.Token;
                // TODO: Save token and user info if rememberMe is true
                return true;
            }
            
            return false;
        }
        catch
        {
            return false;
        }
    }

    public string GetToken() => _token;
    
    // TODO: Implement logout, token refresh, etc.
}
