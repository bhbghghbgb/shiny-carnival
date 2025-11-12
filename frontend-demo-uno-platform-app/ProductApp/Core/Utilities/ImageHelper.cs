using Microsoft.UI.Xaml.Media.Imaging;

namespace ProductApp.Core.Utilities;

public static class ImageHelper
{
    public static async Task<BitmapImage?> LoadProductImageAsync(int productId, string baseUrl = "http://10.0.2.2:5000")
    {
        try
        {
            var imageUrl = $"{baseUrl}/images/product/{productId}.png";
            var bitmapImage = new BitmapImage();
            await bitmapImage.SetSourceAsync(new Uri(imageUrl));
            return bitmapImage;
        }
        catch (Exception)
        {
            // Return null if image fails to load - we'll handle this in XAML
            return null;
        }
    }

    public static BitmapImage GetDefaultProductImage()
    {
        return new BitmapImage(new Uri("ms-appx:///Assets/default-product.png"));
    }

    public static BitmapImage GetErrorImage()
    {
        return new BitmapImage(new Uri("ms-appx:///Assets/error-image.png"));
    }
}
