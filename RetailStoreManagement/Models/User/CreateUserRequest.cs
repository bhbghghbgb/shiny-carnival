using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.User;

public class CreateUserRequest
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(0, 1)]
    public int Role { get; set; } // 0: Admin, 1: Staff
}
