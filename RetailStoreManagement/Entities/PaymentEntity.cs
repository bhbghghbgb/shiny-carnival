using System.ComponentModel.DataAnnotations;

using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class PaymentEntity : BaseEntity<int>
{
    [Required]
    public int OrderId { get; set; }

    [Required]
    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Cash;

    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual OrderEntity Order { get; set; } = null!;
}