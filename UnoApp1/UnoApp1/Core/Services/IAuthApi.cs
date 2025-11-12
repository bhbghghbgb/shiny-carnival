using UnoApp1.Models;
using Refit;

namespace UnoApp1.Core.Services;

public interface IAuthApi
{
    [Post("/api/auth/login")]
    Task<LoginResponse> LoginAsync([Body] LoginRequest request);
}
