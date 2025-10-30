using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Categories;

public class UpdateCategoryRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
}
