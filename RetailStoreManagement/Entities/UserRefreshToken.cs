using System;
using System.ComponentModel.DataAnnotations;


namespace RetailStoreManagement.Entities
{
    public class UserRefreshToken : BaseEntity<Guid>
    {
        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public DateTime ExpiresAt { get; set; }

        [Required]
        public bool IsRevoked { get; set; }

        [Required]
        public int UserId { get; set; }

        // Navigation property
        public virtual UserEntity? User { get; set; }
    }
}

