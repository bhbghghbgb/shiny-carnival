using Refit;

namespace UnoApp4.Services.Api;

public interface IAuthApi
{
    [Post("/Auth/login")]
    Task<UnoApp4.Models.ApiResponse<LoginResponse>> Login([Body] LoginRequest request);
}
