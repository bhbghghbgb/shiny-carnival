namespace RetailStoreManagement.Models.User;

public class UserResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Role { get; set; } // 0: Admin, 1: Staff
    public int TotalOrders { get; set; }
    public DateTime CreatedAt { get; set; }
}
