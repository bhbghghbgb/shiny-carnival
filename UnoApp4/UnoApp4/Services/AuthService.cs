using UnoApp4.Services.Api;
using System.Text.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;
using Uno.Extensions.Logging;
using UnoApp4.Services.Interfaces;

namespace UnoApp4.Services;

public class AuthService : IAuthService
{
    private readonly IAuthApi _authApi;
    private readonly ITokenCache _tokenCache;
    private readonly HttpClient _httpClient;
    private readonly ILogger _logger;

    // Store token in memory
    private string _accessToken;
    private string _refreshToken;
    private UserDto _currentUser;

    public AuthService(
        IAuthApi authApi,
        ITokenCache tokenCache,
        HttpClient httpClient,
        ILogger<AuthService> logger)
    {
        _authApi = authApi;
        _tokenCache = tokenCache;
        _httpClient = httpClient;
        _logger = logger;

        // Configure HttpClient with auth interceptor
        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<LoginResult> LoginAsync(string username, string password, bool rememberMe = false)
    {
        try
        {
            _logger.LogInformation("Attempting login for user: {Username}", username);

            var request = new LoginRequest
            {
                Username = username,
                Password = password
            };

            var response = await _authApi.Login(request);

            if (response != null && !response.IsError && response.Data != null)
            {
                _accessToken = response.Data.Token;
                _refreshToken = response.Data.RefreshToken;
                _currentUser = response.Data.User;

                // Store tokens in secure storage if rememberMe is true
                if (rememberMe)
                {
                    await StoreTokensAsync(response.Data);
                }
                else
                {
                    // Store tokens in memory only (will be lost on app restart)
                    await StoreTokensInMemoryCache(response.Data);
                }

                _logger.LogInformation("Login successful for user: {Username}", username);
                return new LoginResult
                {
                    IsSuccess = true,
                    Token = response.Data.Token,
                    RefreshToken = response.Data.RefreshToken,
                    User = response.Data.User
                };
            }

            _logger.LogWarning("Login failed for user: {Username}", username);
            return new LoginResult
            {
                IsSuccess = false,
                ErrorMessage = response?.Message ?? "Login failed"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for user: {Username}", username);
            return new LoginResult
            {
                IsSuccess = false,
                ErrorMessage = "Network error. Please check your connection."
            };
        }
    }

    public async Task<RefreshTokenResult> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            _logger.LogInformation("Refreshing token");

            if (string.IsNullOrEmpty(refreshToken))
            {
                _logger.LogWarning("No refresh token provided");
                return new RefreshTokenResult
                {
                    IsSuccess = false,
                    ErrorMessage = "No refresh token available"
                };
            }

            var request = new RefreshTokenRequest
            {
                RefreshToken = refreshToken
            };

            var response = await _authApi.RefreshToken(request);

            if (response != null && !response.IsError && response.Data != null)
            {
                // IMPORTANT: Refresh token response only returns Token and User
                // Keep the original refresh token for future use
                _accessToken = response.Data.Token;
                // _refreshToken remains the same (API doesn't return new refresh token)
                _currentUser = response.Data.User;

                // Store the new access token with the existing refresh token
                await StoreRefreshedTokensAsync(response.Data, refreshToken);

                _logger.LogInformation("Token refresh successful");
                return new RefreshTokenResult
                {
                    IsSuccess = true,
                    Token = response.Data.Token,
                    RefreshToken = refreshToken, // Keep the same refresh token
                    User = response.Data.User
                };
            }

            _logger.LogWarning("Token refresh failed");
            return new RefreshTokenResult
            {
                IsSuccess = false,
                ErrorMessage = response?.Message ?? "Token refresh failed"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Token refresh error");
            return new RefreshTokenResult
            {
                IsSuccess = false,
                ErrorMessage = "Failed to refresh token"
            };
        }
    }

    public async Task<bool> LogoutAsync()
    {
        try
        {
            var refreshToken = GetRefreshToken();
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var request = new RefreshTokenRequest
                {
                    RefreshToken = refreshToken
                };

                // Call logout API
                var response = await _authApi.Logout(request);

                if (response != null && !response.IsError)
                {
                    _logger.LogInformation("Logout API call successful");
                }
                else
                {
                    _logger.LogWarning("Logout API call failed");
                }
            }

            // Clear tokens
            _accessToken = null;
            _refreshToken = null;
            _currentUser = null;

            // Clear stored tokens
            await _tokenCache.ClearAsync();

            _logger.LogInformation("User logged out");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Logout error");

            // Even if API call fails, clear local tokens
            _accessToken = null;
            _refreshToken = null;
            _currentUser = null;
            await _tokenCache.ClearAsync();

            return true; // Consider logout successful locally
        }
    }

    public async Task<UserDto> GetCurrentUserAsync()
    {
        if (_currentUser != null)
            return _currentUser;

        try
        {
            // Try to load from cache
            await TryLoadStoredTokensAsync();

            // If still no user, try to get from API
            if (_currentUser == null && !string.IsNullOrEmpty(_accessToken))
            {
                var response = await _authApi.GetProfile();
                if (response != null && !response.IsError && response.Data != null)
                {
                    _currentUser = response.Data;
                }
            }

            return _currentUser;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get current user");
            return null;
        }
    }

    public string GetAccessToken() => _accessToken;
    public string GetRefreshToken() => _refreshToken;
    public UserDto GetCurrentUser() => _currentUser;

    public bool IsAuthenticated()
    {
        return !string.IsNullOrEmpty(_accessToken) && _currentUser != null;
    }

    private async Task StoreTokensAsync(LoginResponse loginData)
    {
        try
        {
            var tokens = new Dictionary<string, string>
            {
                [TokenCacheExtensions.AccessTokenKey] = loginData.Token,
                [TokenCacheExtensions.RefreshTokenKey] = loginData.RefreshToken
            };

            if (loginData.User != null)
            {
                tokens["UserId"] = loginData.User.Id.ToString();
                tokens["Username"] = loginData.User.Username;
                tokens["UserFullName"] = loginData.User.FullName;
                tokens["UserRole"] = loginData.User.Role.ToString();

                // Store full user object as JSON
                tokens["User"] = JsonSerializer.Serialize(loginData.User);
            }

            await _tokenCache.SaveAsync(tokens);
            _logger.LogDebug("Tokens stored securely");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to store tokens");
        }
    }

    private async Task StoreRefreshedTokensAsync(RefreshTokenResponse refreshData, string existingRefreshToken)
    {
        try
        {
            var tokens = await _tokenCache.GetAsync(CancellationToken.None) ?? new Dictionary<string, string>();

            // Update access token
            tokens[TokenCacheExtensions.AccessTokenKey] = refreshData.Token;

            // Keep the existing refresh token (API doesn't return new one)
            if (!tokens.ContainsKey(TokenCacheExtensions.RefreshTokenKey))
            {
                tokens[TokenCacheExtensions.RefreshTokenKey] = existingRefreshToken;
            }

            // Update user info
            if (refreshData.User != null)
            {
                tokens["UserId"] = refreshData.User.Id.ToString();
                tokens["Username"] = refreshData.User.Username;
                tokens["UserFullName"] = refreshData.User.FullName;
                tokens["UserRole"] = refreshData.User.Role.ToString();
                tokens["User"] = JsonSerializer.Serialize(refreshData.User);
            }

            await _tokenCache.SaveAsync(tokens);
            _logger.LogDebug("Refreshed tokens stored");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to store refreshed tokens");
        }
    }

    private async Task StoreTokensInMemoryCache(LoginResponse loginData)
    {
        try
        {
            // Store in a temporary cache (will be lost on app restart)
            var tokens = new Dictionary<string, string>
            {
                ["TempAccessToken"] = loginData.Token,
                ["TempRefreshToken"] = loginData.RefreshToken
            };

            if (loginData.User != null)
            {
                tokens["TempUserId"] = loginData.User.Id.ToString();
                tokens["TempUsername"] = loginData.User.Username;
            }

            await _tokenCache.SaveAsync(tokens);
            _logger.LogDebug("Tokens stored in memory cache");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to store tokens in memory cache");
        }
    }

    public async Task<bool> TryLoadStoredTokensAsync()
    {
        try
        {
            var tokens = await _tokenCache.GetAsync();

            if (tokens != null)
            {
                // Try to load from secure storage first
                if (tokens.TryGetValue(TokenCacheExtensions.AccessTokenKey, out var accessToken) &&
                    tokens.TryGetValue(TokenCacheExtensions.RefreshTokenKey, out var refreshToken))
                {
                    _accessToken = accessToken;
                    _refreshToken = refreshToken;

                    // Load user data
                    if (tokens.TryGetValue("User", out var userJson))
                    {
                        _currentUser = JsonSerializer.Deserialize<UserDto>();
                    }
                    else if (tokens.TryGetValue("UserId", out var userIdStr) &&
                             int.TryParse(userIdStr, out var userId))
                    {
                        _currentUser = new UserDto
                        {
                            Id = userId,
                            Username = tokens.TryGetValue("Username", out var username) ? username : string.Empty,
                            FullName = tokens.TryGetValue("UserFullName", out var fullName) ? fullName : string.Empty,
                            Role = tokens.TryGetValue("UserRole", out var roleStr) &&
                                   int.TryParse(roleStr, out var role)
                                ? role
                                : 0
                        };
                    }

                    _logger.LogInformation("Loaded tokens from secure storage");
                    return true;
                }
                // Fallback to memory cache
                else if (tokens.TryGetValue("TempAccessToken", out var tempAccessToken) &&
                         tokens.TryGetValue("TempRefreshToken", out var tempRefreshToken))
                {
                    _accessToken = tempAccessToken;
                    _refreshToken = tempRefreshToken;

                    if (tokens.TryGetValue("TempUserId", out var tempUserIdStr) &&
                        int.TryParse(tempUserIdStr, out var tempUserId))
                    {
                        _currentUser = new UserDto
                        {
                            Id = tempUserId,
                            Username = tokens.TryGetValue("TempUsername", out var tempUsername)
                                ? tempUsername
                                : string.Empty
                        };
                    }

                    _logger.LogInformation("Loaded tokens from memory cache");
                    return true;
                }
            }

            _logger.LogInformation("No stored tokens found");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load stored tokens");
            return false;
        }
    }

    // Clear only temporary tokens (for "remember me = false" scenario)
    public async Task ClearTemporaryTokensAsync()
    {
        try
        {
            var tokens = await _tokenCache.GetAsync();
            if (tokens != null)
            {
                // Remove temporary tokens but keep secure ones
                tokens.Remove("TempAccessToken");
                tokens.Remove("TempRefreshToken");
                tokens.Remove("TempUserId");
                tokens.Remove("TempUsername");

                await _tokenCache.SaveAsync(tokens);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to clear temporary tokens");
        }
    }
}

