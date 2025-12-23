namespace RetailStoreManagement.Models.ImageKit;

public class ImageKitAuthResponse
{
    public string Signature { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public long Expire { get; set; }
    public string PublicKey { get; set; } = string.Empty;
}

