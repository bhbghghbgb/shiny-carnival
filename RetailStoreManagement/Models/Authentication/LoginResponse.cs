using System.Text.Json.Serialization;
using RetailStoreManagement.Models.Authentication;

namespace RetailStoreManagement.Models;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RefreshToken { get; set; }
    public UserDto User { get; set; } = null!;
}