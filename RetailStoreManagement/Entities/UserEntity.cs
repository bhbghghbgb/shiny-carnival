using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class UserEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(50)]
    [Column("username")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("password")]
    public string Password { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("full_name")]
    public string? FullName { get; set; }

    [Required]
    [Column("role")]
    public UserRole Role { get; set; } = UserRole.Staff;

    // Navigation properties
    public virtual ICollection<OrderEntity> Orders { get; set; } = new List<OrderEntity>();
}