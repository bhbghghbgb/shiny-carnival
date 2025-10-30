using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Users;

public class CreateUserRequest
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(0, 1)]
    public int Role { get; set; }
}
