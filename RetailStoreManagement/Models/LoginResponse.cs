using RetailStoreManagement.Models.Authentication;

namespace RetailStoreManagement.Models;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}