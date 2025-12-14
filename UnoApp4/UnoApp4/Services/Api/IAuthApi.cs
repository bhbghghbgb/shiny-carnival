using Refit;
using System.Threading.Tasks;
using System.Net.Http;

namespace UnoApp4.Services.Api;

public interface IAuthApi
{
    [Post("/Auth/login")]
    Task<Models.ApiResponse<LoginResponse>> Login([Body] LoginRequest request);

    [Post("/Auth/refresh")]
    Task<Models.ApiResponse<RefreshTokenResponse>> RefreshToken([Body] RefreshTokenRequest request);

    [Post("/Auth/logout")]
    Task<Models.ApiResponse<object>> Logout([Body] RefreshTokenRequest request);

    // Get user profile
    [Get("/Auth/profile")]
    Task<Models.ApiResponse<UserDto>> GetProfile();
}
