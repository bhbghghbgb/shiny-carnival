using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Category;

public class CreateCategoryRequest
{
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
}
