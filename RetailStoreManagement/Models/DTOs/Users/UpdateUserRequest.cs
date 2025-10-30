using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Users;

public class UpdateUserRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [MinLength(6)]
    [MaxLength(100)]
    public string? Password { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(0, 1)]
    public int Role { get; set; }
}
