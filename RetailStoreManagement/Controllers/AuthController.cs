using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models;
using RetailStoreManagement.Models.Authentication;
using RetailStoreManagement.Models.User;
using RetailStoreManagement.Services;

namespace RetailStoreManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;

    public AuthController(IAuthService authService, IUserService userService, IConfiguration configuration, IWebHostEnvironment environment)
    {
        _authService = authService;
        _userService = userService;
        _configuration = configuration;
        _environment = environment;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (!result.IsError && result.Data != null)
        {
            // Set httpOnly cookies cho access token và refresh token
            SetTokenCookies(result.Data.Token, result.Data.RefreshToken);
        }

        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("setup-admin")]
    public async Task<IActionResult> SetupAdmin([FromBody] CreateUserRequest request)
    {
        var result = await _userService.SetupAdminAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        // Luôn đọc token từ HttpOnly cookies
        var request = new RefreshTokenRequest
        {
            AccessToken = Request.Cookies["accessToken"] ?? string.Empty,
            RefreshToken = Request.Cookies["refreshToken"] ?? string.Empty
        };

        var result = await _authService.RefreshTokenAsync(request);

        if (!result.IsError && result.Data != null)
        {
            // Set httpOnly cookies cho tokens mới
            SetTokenCookies(result.Data.Token, request.RefreshToken);
        }

        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequest? request)
    {
        // Đọc refresh token từ cookie nếu không có trong body
        if (request == null || string.IsNullOrEmpty(request.RefreshToken))
        {
            request = new LogoutRequest
            {
                RefreshToken = Request.Cookies["refreshToken"] ?? string.Empty
            };
        }

        var result = await _authService.LogoutAsync(request);

        // Xóa cookies
        ClearTokenCookies();

        return StatusCode(result.StatusCode, result);
    }

    private void SetTokenCookies(string accessToken, string refreshToken)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var accessTokenExpiry = int.Parse(jwtSettings["AccessTokenExpirationInMinutes"] ?? "15");
        var refreshTokenExpiry = int.Parse(jwtSettings["RefreshTokenExpirationInMinutes"] ?? "1"); // 1 ngày

        // Trong development, không set Domain để cookies hoạt động với localhost:port khác nhau
        // Trong production, có thể cần set Domain nếu frontend và backend cùng domain
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, // Chống XSS
            Secure = !_environment.IsDevelopment(), // HTTPS trong production
            SameSite = SameSiteMode.Lax, // Chống CSRF
            Path = "/",
            // Không set Domain để cookies hoạt động với localhost:port khác nhau
            // Domain chỉ cần set nếu frontend và backend ở subdomain khác nhau
        };

        var accessTokenOptions = new CookieOptions
        {
            HttpOnly = cookieOptions.HttpOnly,
            Secure = cookieOptions.Secure,
            SameSite = cookieOptions.SameSite,
            Path = cookieOptions.Path,
            MaxAge = TimeSpan.FromMinutes(accessTokenExpiry)
        };
        
        Response.Cookies.Append("accessToken", accessToken, accessTokenOptions);

        if (!string.IsNullOrEmpty(refreshToken))
        {
            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = cookieOptions.HttpOnly,
                Secure = cookieOptions.Secure,
                SameSite = cookieOptions.SameSite,
                Path = cookieOptions.Path,
                MaxAge = TimeSpan.FromDays(refreshTokenExpiry)
            };
            
            Response.Cookies.Append("refreshToken", refreshToken, refreshTokenOptions);
        }
    }

    private void ClearTokenCookies()
    {
        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");
    }
}

