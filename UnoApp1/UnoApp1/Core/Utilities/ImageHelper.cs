using Windows.Storage.Streams;
using Microsoft.UI.Xaml.Media.Imaging;

namespace UnoApp1.Core.Utilities;

public static class ImageHelper
{
    private static readonly HttpClient _httpClient = new();

    public static async Task<BitmapImage?> LoadProductImageAsync(int productId, string baseUrl = "http://10.0.2.2:5000")
    {
         try
         {
             var imageUrl = $"{baseUrl}/images/product/{productId}.png";
             
             // 1. Download the image as a Stream
             // GetStreamAsync is more memory-efficient than GetByteArrayAsync
             using (var stream = await _httpClient.GetStreamAsync(imageUrl))
             {
                 // 2. Create the BitmapImage
                 var bitmapImage = new BitmapImage();
                 
                 // 3. Set the source from the Stream
                 // This is the fix for the error you encountered.
                 await bitmapImage.SetSourceAsync(stream.AsRandomAccessStream());
                 
                 return bitmapImage;
             }
         }
         catch (HttpRequestException)
         {
             // Handle HTTP-specific errors (404, network issues, etc.)
             return null;
         }
         catch (Exception)
         {
             // Catch other potential issues (e.g., image decoding errors)
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
