using Refit;
using UnoApp3.Models.Auth;
using UnoApp3.Models.Common;

namespace UnoApp3.Services.Api;

public interface IAuthApi
{
    [Post("/Auth/login")]
    Task<Models.Common.ApiResponse<LoginResponse>> Login([Body] LoginRequest request);
}
