using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Models.UserModel;

public class UserResponse
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public UserRole Role { get; set; }
}

