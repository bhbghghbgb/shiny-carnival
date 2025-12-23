using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.ImageKit;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/imagekit")]
[Authorize]
public class ImageKitController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ImageKitController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Lấy authentication parameters để upload ảnh lên ImageKit từ frontend.
    /// </summary>
    [HttpPost("auth")]
    public IActionResult GetUploadAuth()
    {
        try
        {
            var privateKey = _configuration["ImageKit:PrivateKey"];
            var publicKey = _configuration["ImageKit:PublicKey"];

            if (string.IsNullOrEmpty(privateKey) || string.IsNullOrEmpty(publicKey))
            {
                return StatusCode(500, ApiResponse<object>.Error(
                    "ImageKit configuration is missing. Please configure ImageKit:PrivateKey and ImageKit:PublicKey in appsettings.json",
                    500
                ));
            }

            // Generate token (unique string)
            var token = Guid.NewGuid().ToString();

            // Generate expire timestamp
            // ImageKit requires expire to be Unix timestamp in seconds, less than 1 hour in the future
            // Set expire to 55 minutes to ensure it's always less than 1 hour
            var expire = DateTimeOffset.UtcNow.AddMinutes(55).ToUnixTimeSeconds();

            // Generate signature: HMAC-SHA1 of (token + expire) using private key
            var signature = GenerateSignature(token, expire.ToString(), privateKey);

            var authParams = new ImageKitAuthResponse
            {
                Signature = signature,
                Token = token,
                Expire = expire,
                PublicKey = publicKey
            };

            return Ok(ApiResponse<ImageKitAuthResponse>.Success(authParams, "ImageKit upload authentication parameters"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Error($"Error generating ImageKit auth: {ex.Message}", 500));
        }
    }

    private static string GenerateSignature(string token, string expire, string privateKey)
    {
        // ImageKit requires signature to be HMAC-SHA1 of (token + expire) in HEX format, not Base64
        var data = token + expire;
        using var hmac = new HMACSHA1(Encoding.UTF8.GetBytes(privateKey));
        var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        
        // Convert to hexadecimal string (lowercase)
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
    }
}

