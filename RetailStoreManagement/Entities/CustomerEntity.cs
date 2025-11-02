using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailStoreManagement.Entities;

public class CustomerEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("email")]
    public string? Email { get; set; }

    [MaxLength(1024)]
    [Column("address")]
    public string? Address { get; set; }
    
    // Navigation properties
    public virtual ICollection<OrderEntity> Orders { get; set; } = new List<OrderEntity>();
}