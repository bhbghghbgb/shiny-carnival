using System;
using Microsoft.UI.Xaml.Data;

namespace UnoApp3.Helpers.Converters;

public class InverseBoolConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        return !(value is bool boolValue && boolValue);
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        return !(value is bool boolValue && boolValue);
    }
}
