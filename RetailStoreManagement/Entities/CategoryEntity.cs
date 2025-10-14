using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailStoreManagement.Entities;

public class CategoryEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    [Column("category_name")]
    public string CategoryName { get; set; } = string.Empty;

    // Navigation properties
    public virtual ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
}