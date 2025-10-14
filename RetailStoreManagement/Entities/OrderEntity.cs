using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class OrderEntity : BaseEntity<int>
{
    [Column("customer_id")]
    public int CustomerId { get; set; }

    [Required]
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("promo_id")]
    public int? PromoId { get; set; }

    [Column("order_date")]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    [Column("status")]
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    [Column("total_amount", TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }

    [Column("discount_amount", TypeName = "decimal(10,2)")]
    public decimal DiscountAmount { get; set; } = 0;

    // Navigation properties
    [ForeignKey("CustomerId")]
    public virtual CustomerEntity? Customer { get; set; }

    [ForeignKey("UserId")]
    public virtual UserEntity User { get; set; } = null!;

    [ForeignKey("PromoId")]
    public virtual PromotionEntity? Promotion { get; set; }

    public virtual ICollection<OrderItemEntity> OrderItems { get; set; } = new List<OrderItemEntity>();
    public virtual ICollection<PaymentEntity> Payments { get; set; } = new List<PaymentEntity>();
}