using Microsoft.UI.Xaml.Data;

namespace UnoApp4.Helpers.Converters;

public class StringToVisibilityConverter : IValueConverter
{
    // Convert string to Visibility
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        // Convert value to string first
        var strValue = value as string;

        // If string is null or empty, collapse UI element
        return string.IsNullOrEmpty(strValue)
            ? Visibility.Collapsed
            :
            // Otherwise, make it visible
            Visibility.Visible;
    }

    // Back conversion (optional)
    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        // Usually not implemented for one-way binding
        throw new NotImplementedException();
    }
}
