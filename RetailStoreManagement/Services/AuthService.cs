using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models;

namespace RetailStoreManagement.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
}

public class AuthService : IAuthService
{
    public Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        // Hardcoded admin/admin login
        if (request is not { Username: "admin", Password: "admin" })
        {
            return Task.FromResult(ApiResponse<LoginResponse>.Fail("Invalid credentials"));
        }

        var response = new LoginResponse
        {
            Token = GenerateJwtToken("admin", "Admin"),
            Username = "admin",
            Role = "Admin"
        };
        return Task.FromResult(ApiResponse<LoginResponse>.Success(response));
    }

    private string GenerateJwtToken(string username, string role)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey("your-super-secret-key-at-least-32-chars"u8.ToArray());
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "store-management",
            audience: "store-management",
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}