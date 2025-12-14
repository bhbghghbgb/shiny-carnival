using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Category;

public class CreateCategoryRequest
{
    [Required]
    [MaxLength(MAX_LENGTH_NAME)]
    public string CategoryName { get; set; } = string.Empty;
}
