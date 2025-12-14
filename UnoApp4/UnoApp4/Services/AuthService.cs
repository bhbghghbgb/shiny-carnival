using UnoApp4.Services.Api;

namespace UnoApp4.Services;

public class AuthService(IAuthApi authApi)
{
    // TODO: Implement token storage
    private string _token;

    public async Task<bool> LoginAsync(string username, string password, bool rememberMe)
    {
        try
        {
            var request = new LoginRequest
            {
                Username = username,
                Password = password
            };
            
            var response = await authApi.Login(request);
            
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
