using Microsoft.UI.Xaml.Data;

namespace UnoApp1.Converters;

public class NotEqualConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        return !object.Equals(value, parameter);
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}
