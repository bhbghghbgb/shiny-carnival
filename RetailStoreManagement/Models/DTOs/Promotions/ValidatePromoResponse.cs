namespace RetailStoreManagement.Models.DTOs.Promotions;

public class ValidatePromoResponse
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public int? PromoId { get; set; }
}
