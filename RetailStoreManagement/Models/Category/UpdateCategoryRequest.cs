using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Category;

public class UpdateCategoryRequest
{
    [MaxLength(MAX_LENGTH_NAME)]
    public string? CategoryName { get; set; }
}
