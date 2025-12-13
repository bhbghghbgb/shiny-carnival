using Microsoft.UI.Xaml.Data;
using System;

namespace UnoApp3.Helpers.Converters
{
    public class QuantityIsGreaterThanOneToBoolConverter : IValueConverter
    {
        /// <summary>
        /// Converts an integer quantity to a boolean. Returns true if the quantity > 1.
        /// </summary>
        /// <param name="value">The integer quantity (expected).</param>
        /// <returns>True if value is greater than 1; otherwise, false.</returns>
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            if (value is int quantity)
            {
                return quantity > 1;
            }

            // Fallback for null or unexpected types
            return false;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
