using System.ComponentModel.DataAnnotations;


namespace RetailStoreManagement.Entities;

public class CategoryEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;

    // Navigation properties
    public virtual ICollection<ProductEntity> Products { get; set; } = new List<ProductEntity>();
}