using Microsoft.UI.Xaml.Data;

namespace UnoApp4.Helpers.Converters;

public class ProductImageUrlConverter : IValueConverter
{
    public static string? BaseImageUrl { get; set; }

    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is not int productId || string.IsNullOrEmpty(BaseImageUrl))
        {
            return "http://localhost/images";
        }

        return !string.IsNullOrEmpty(BaseImageUrl)
            ? $"{BaseImageUrl.TrimEnd('/')}/images/{productId}"
            : $"http://localhost/images/{productId}";
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}
