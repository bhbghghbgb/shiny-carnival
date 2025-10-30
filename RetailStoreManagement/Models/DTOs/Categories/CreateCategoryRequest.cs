using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Categories;

public class CreateCategoryRequest
{
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
}
