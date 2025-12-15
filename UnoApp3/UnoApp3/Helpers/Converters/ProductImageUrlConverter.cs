using System;
using Microsoft.Extensions.Configuration;
using Microsoft.UI.Xaml.Data;

namespace UnoApp3.Helpers.Converters;

public class ProductImageUrlConverter : IValueConverter
{
    public static string BaseImageUrl { get; set; }

    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is int productId && !string.IsNullOrEmpty(BaseImageUrl))
        {
            return $"{BaseImageUrl.TrimEnd('/')}/images/{productId}";
        }
        return null;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}
