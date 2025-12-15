namespace RetailStoreManagement.Models.Authentication
{
    public class RefreshTokenRequest
    {
        // Cho phép rỗng để controller tự đọc từ HttpOnly cookies
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}

