using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Authentication
{
    public class LogoutRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}

