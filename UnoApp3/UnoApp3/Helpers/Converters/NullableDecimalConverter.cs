using Microsoft.UI.Xaml.Data;

namespace UnoApp3.Helpers.Converters;

public class NullableDecimalConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        return value?.ToString() ?? string.Empty;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        if (string.IsNullOrWhiteSpace(value as string))
            return null;

        if (decimal.TryParse(value as string, out decimal result))
            return result;

        return null;
    }
}
