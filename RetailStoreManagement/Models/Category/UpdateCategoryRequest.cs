using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Category;

public class UpdateCategoryRequest
{
    [MaxLength(100)]
    public string? CategoryName { get; set; }
}
