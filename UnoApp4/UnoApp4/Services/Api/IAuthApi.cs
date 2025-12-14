using Refit;
using UnoApp4.Models;

namespace UnoApp4.Services.Api;

public interface IAuthApi
{
    [Post("/Auth/login")]
    Task<Models.ApiResponse<LoginResponse>> Login([Body] LoginRequest request);

    [Post("/Auth/refresh")]
    [Headers("Authorization: Bearer")]
    Task<Models.ApiResponse<RefreshTokenResponse>> RefreshToken([Body] RefreshTokenRequest request);

    [Post("/Auth/logout")]
    [Headers("Authorization: Bearer")]
    Task<Models.ApiResponse<LogoutResponse>> Logout([Body] LogoutRequest request);
}
