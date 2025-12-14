using Refit;
using UnoApp4.Models;

namespace UnoApp4.Services.Api;

public interface IAuthApi
{
    [Post("/Auth/login")]
    Task<Models.ApiResponse<LoginResponse>> Login([Body] LoginRequest request);

    [Post("/Auth/refresh")]
    Task<Models.ApiResponse<RefreshTokenResponse>> RefreshToken(
        [Body] RefreshTokenRequest request,
        [Header("Authorization")] string authorization);

    [Post("/Auth/logout")]
    Task<Models.ApiResponse<object>> Logout(
        [Body] LogoutRequest request,
        [Header("Authorization")] string authorization);
}
