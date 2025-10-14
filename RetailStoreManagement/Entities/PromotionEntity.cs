using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class PromotionEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(50)]
    [Column("promo_code")]
    public string PromoCode { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [Column("discount_type")]
    public DiscountType DiscountType { get; set; }

    [Required]
    [Column("discount_value", TypeName = "decimal(10,2)")]
    public decimal DiscountValue { get; set; }

    [Required]
    [Column("start_date")]
    public DateOnly StartDate { get; set; }

    [Required]
    [Column("end_date")]
    public DateOnly EndDate { get; set; }

    [Column("min_order_amount", TypeName = "decimal(10,2)")]
    public decimal MinOrderAmount { get; set; } = 0;

    [Column("usage_limit")]
    public int UsageLimit { get; set; } = 0;

    [Column("used_count")]
    public int UsedCount { get; set; } = 0;

    [Column("status")]
    public PromotionStatus Status { get; set; } = PromotionStatus.Active;

    // Navigation properties
    public virtual ICollection<OrderEntity> Orders { get; set; } = new List<OrderEntity>();
}