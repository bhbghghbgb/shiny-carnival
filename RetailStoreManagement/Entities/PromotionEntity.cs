using System.ComponentModel.DataAnnotations;

using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class PromotionEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(50)]
    public string PromoCode { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }

    [Required]
    public DiscountType DiscountType { get; set; }

    [Required]
    public decimal DiscountValue { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    [Required]
    public DateOnly EndDate { get; set; }

    public decimal MinOrderAmount { get; set; } = 0;

    public int UsageLimit { get; set; } = 0;

    public int UsedCount { get; set; } = 0;

    public PromotionStatus Status { get; set; } = PromotionStatus.Active;

    // Navigation properties
    public virtual ICollection<OrderEntity> Orders { get; set; } = new List<OrderEntity>();
}