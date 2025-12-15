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
    private readonly IFakeDataService _fakeDataService;
    private readonly AppConfig _config;
    private string? _token;

    public AuthService(IAuthApi authApi, IFakeDataService fakeDataService, AppConfig config)
    {
        _authApi = authApi;
        _fakeDataService = fakeDataService;
        _config = config;
    }

    public async Task<bool> LoginAsync(string username, string password)
    {
        try
        {
            if (_config.UseFakeData)
            {
                // Simulate API delay
                await Task.Delay(1000);
                
                // For demo, accept any non-empty credentials
                if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
                {
                    var fakeResponse = _fakeDataService.GetSampleLoginResponse();
                    _token = fakeResponse.Token;
                    return true;
                }
                return false;
            }
            else
            {
                var request = new LoginRequest { Username = username, Password = password };
                var response = await _authApi.LoginAsync(request);
                _token = response.Token;
                return true;
            }
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