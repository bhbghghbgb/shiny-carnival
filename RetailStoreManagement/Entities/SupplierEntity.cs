using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RetailStoreManagement.Entities;

public class SupplierEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(20)]
    [Column("phone")]
    public string? Phone { get; set; }

    [MaxLength(100)]
    [Column("email")]
    public string? Email { get; set; }

    [MaxLength(1024)]
    [Column("address")]
    public string? Address { get; set; }

    // Navigation properties
    [JsonIgnore]
    public virtual ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
}