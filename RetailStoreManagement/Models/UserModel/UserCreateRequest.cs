using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Models;

public class UserCreateRequest
{
    public string Username { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string? FullName { get; set; }

    public UserRole Role { get; set; } = UserRole.Staff;
}