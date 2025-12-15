using ProductApp.Models;
using Refit;

namespace ProductApp.Core.Services;

public interface IAuthApi
{
    [Post("/api/auth/login")]
    Task<LoginResponse> LoginAsync([Body] LoginRequest request);
}
