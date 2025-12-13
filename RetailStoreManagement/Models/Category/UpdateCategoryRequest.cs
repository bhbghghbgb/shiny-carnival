using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Category;

public class UpdateCategoryRequest
{
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
}
