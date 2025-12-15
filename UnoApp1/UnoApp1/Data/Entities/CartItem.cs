using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UnoApp1.Data.Entities;

public class CartItem
{
    [System.ComponentModel.DataAnnotations.Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int ProductId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string ProductName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    public int Quantity { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    
    [NotMapped]
    public decimal TotalPrice => Price * Quantity;
}
