using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class PaymentEntity : BaseEntity<int>
{
    [Required]
    [Column("order_id")]
    public int OrderId { get; set; }

    [Required]
    [Column("amount", TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    [Column("payment_method")]
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;

    [Column("payment_date")]
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("OrderId")]
    public virtual OrderEntity Order { get; set; } = null!;
}