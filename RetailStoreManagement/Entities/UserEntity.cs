using System.ComponentModel.DataAnnotations;

using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class UserEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? FullName { get; set; }

    [Required]
    public UserRole Role { get; set; } = UserRole.Staff;

    // Navigation properties
    public virtual ICollection<OrderEntity> Orders { get; set; } = new List<OrderEntity>();
    public virtual ICollection<UserRefreshToken> UserRefreshTokens { get; set; } = new List<UserRefreshToken>();
}
