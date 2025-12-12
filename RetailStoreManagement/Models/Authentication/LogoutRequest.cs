namespace RetailStoreManagement.Models.Authentication
{
    public class LogoutRequest
    {
        // Cho phép rỗng để controller tự đọc từ HttpOnly cookies
        public string RefreshToken { get; set; } = string.Empty;
    }
}

