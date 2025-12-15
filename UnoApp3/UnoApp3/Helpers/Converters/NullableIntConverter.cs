using Microsoft.UI.Xaml.Data;

namespace UnoApp3.Helpers.Converters;

public class NullableIntConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        return value?.ToString() ?? string.Empty;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        if (string.IsNullOrWhiteSpace(value as string))
            return null;

        if (int.TryParse(value as string, out int result))
            return result;

        return null;
    }
}
