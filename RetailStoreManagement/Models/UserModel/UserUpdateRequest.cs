using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Models;

public class UserUpdateRequest
{
    public string? FullName { get; set; }

    public string? Password { get; set; }

    public UserRole? Role { get; set; }
}