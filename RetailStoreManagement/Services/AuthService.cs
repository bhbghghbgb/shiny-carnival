using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AutoMapper;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models;
using RetailStoreManagement.Models.Authentication;
using RetailStoreManagement.Interfaces;
using BCrypt.Net;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    Task<ApiResponse<object>> LogoutAsync(LogoutRequest request);
}

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await _unitOfWork.Users.GetQueryable()
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return ApiResponse<LoginResponse>.Error("Invalid credentials", 401);
            }

            var userDto = _mapper.Map<UserDto>(user);
            var accessToken = GenerateJwtToken(user);
            var refreshToken = await GenerateRefreshToken(user);

            var response = new LoginResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken.Token,
                User = userDto
            };

            return ApiResponse<LoginResponse>.Success(response, "Login successful");
        }
        catch (Exception ex)
        {
            return ApiResponse<LoginResponse>.Error(ex.Message);
        }
    }

    private string GenerateJwtToken(Entities.UserEntity user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("FullName", user.FullName ?? "")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationInMinutes"]!)),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<Entities.UserRefreshToken> GenerateRefreshToken(UserEntity user)
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var refreshToken = Convert.ToBase64String(randomNumber);

        var newRefreshToken = new Entities.UserRefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(1),
            IsRevoked = false
        };

        await _unitOfWork.UserRefreshTokens.AddAsync(newRefreshToken);
        await _unitOfWork.SaveChangesAsync();

        return newRefreshToken;
    }

    public async Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return ApiResponse<LoginResponse>.Error("Missing refresh token", 400);
            }

            // Tìm refresh token và load user tương ứng
            var refreshToken = await _unitOfWork.UserRefreshTokens.GetQueryable()
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (refreshToken == null || refreshToken.IsRevoked || refreshToken.ExpiresAt <= DateTime.UtcNow)
            {
                return ApiResponse<LoginResponse>.Error("Invalid refresh token", 401);
            }

            var user = refreshToken.User
                ?? await _unitOfWork.Users.GetQueryable().FirstOrDefaultAsync(u => u.Id == refreshToken.UserId);

            if (user == null)
            {
                return ApiResponse<LoginResponse>.Error("Invalid client request", 400);
            }

            // Revoke the old refresh token
            refreshToken.IsRevoked = true;

            // Generate new tokens
            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = await GenerateRefreshToken(user);

            var userDto = _mapper.Map<UserDto>(user);

            var response = new LoginResponse
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken.Token,
                User = userDto
            };

            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<LoginResponse>.Success(response, "Token refreshed successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<LoginResponse>.Error(ex.Message);
        }
    }

    private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!)),
            ValidateLifetime = false, // We don't care if the token is expired
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;

        if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }



    public async Task<ApiResponse<object>> LogoutAsync(LogoutRequest request)
    {
        try
        {
            var refreshToken = await _unitOfWork.UserRefreshTokens.GetQueryable()
                .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);

            if (refreshToken == null)
            {
                return ApiResponse<object>.Error("Invalid refresh token", 400);
            }

            refreshToken.IsRevoked = true;
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<object>.Success(new object(), "Logged out successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<object>.Error(ex.Message);
        }
    }

}