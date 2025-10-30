namespace RetailStoreManagement.Models.DTOs.Users;

public class UserResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Role { get; set; }
    public DateTime CreatedAt { get; set; }
}
