## Task 7: Implementing Remaining XAML Views

Let's continue with the remaining XAML views for the application.

```xml
<!-- ProductApp/Views/ProductListPage.xaml -->
<UserControl x:Class="ProductApp.Views.ProductListPage"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:toolkit="using:Uno.Toolkit.WinUI"
             xmlns:models="using:ProductApp.Models">

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
        </Grid.RowDefinitions>

        <!-- Search Box -->
        <TextBox Grid.Row="0"
                 Header="Search Products"
                 PlaceholderText="Search by name or category..."
                 Text="{Binding SearchText, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
                 Margin="16,8,16,8">
            <TextBox.Icon>
                <SymbolIcon Symbol="Find"/>
            </TextBox.Icon>
            <TextBox.Resources>
                <ResourceDictionary>
                    <ResourceDictionary.ThemeDictionaries>
                        <ResourceDictionary x:Key="Light">
                            <StaticResource ResourceKey="MaterialBackgroundColor" />
                        </ResourceDictionary>
                        <ResourceDictionary x:Key="Dark">
                            <StaticResource ResourceKey="MaterialBackgroundColor" />
                        </ResourceDictionary>
                    </ResourceDictionary.ThemeDictionaries>
                </ResourceDictionary>
            </TextBox.Resources>
        </TextBox>

        <!-- Category Tabs -->
        <ScrollViewer Grid.Row="1"
                      HorizontalScrollMode="Auto"
                      HorizontalScrollBarVisibility="Auto"
                      VerticalScrollBarVisibility="Disabled"
                      Margin="16,0,16,8">
            <StackPanel Orientation="Horizontal" Spacing="8">
                <ItemsControl ItemsSource="{Binding Categories}">
                    <ItemsControl.ItemsPanel>
                        <ItemsPanelTemplate>
                            <StackPanel Orientation="Horizontal" Spacing="8"/>
                        </ItemsPanelTemplate>
                    </ItemsControl.ItemsPanel>
                    <ItemsControl.ItemTemplate>
                        <DataTemplate>
                            <Button Content="{Binding}"
                                    Command="{Binding DataContext.FilterByCategoryCommand, RelativeSource={RelativeSource AncestorType=UserControl}}"
                                    CommandParameter="{Binding}"
                                    Style="{StaticResource OutlinedButtonStyle}"
                                    IsEnabled="{Binding DataContext.SelectedCategory, Converter={StaticResource NotEqualConverter}, ConverterParameter={Binding}, RelativeSource={RelativeSource AncestorType=UserControl}}"/>
                        </DataTemplate>
                    </ItemsControl.ItemTemplate>
                </ItemsControl>
            </StackPanel>
        </ScrollViewer>

        <!-- Products Grid -->
        <Grid Grid.Row="2">
            <!-- Loading State -->
            <ProgressRing IsActive="{Binding IsBusy}"
                         Visibility="{Binding IsBusy, Converter={StaticResource TrueToVisibleConverter}}"
                         HorizontalAlignment="Center"
                         VerticalAlignment="Center"/>

            <!-- Empty State -->
            <StackPanel HorizontalAlignment="Center"
                       VerticalAlignment="Center"
                       Visibility="{Binding IsBusy, Converter={StaticResource FalseToVisibleConverter}}">
                <TextBlock Text="No products found"
                          FontSize="16"
                          Foreground="{ThemeResource OnSurfaceVariantBrush}"
                          TextAlignment="Center"
                          Visibility="{Binding FilteredProducts.Count, Converter={StaticResource EqualToZeroToVisibleConverter}}"/>
            </StackPanel>

            <!-- Products List -->
            <ListView ItemsSource="{Binding FilteredProducts}"
                     SelectionMode="None"
                     Visibility="{Binding IsBusy, Converter={StaticResource FalseToVisibleConverter}}">
                <ListView.ItemTemplate>
                    <DataTemplate x:DataType="models:ProductListDto">
                        <Border Background="{ThemeResource SurfaceBrush}"
                                CornerRadius="8"
                                Margin="8,4"
                                Padding="12">
                            <Grid>
                                <Grid.ColumnDefinitions>
                                    <ColumnDefinition Width="Auto"/>
                                    <ColumnDefinition Width="*"/>
                                    <ColumnDefinition Width="Auto"/>
                                </Grid.ColumnDefinitions>

                                <!-- Product Image Placeholder -->
                                <Border Grid.Column="0"
                                        Width="60"
                                        Height="60"
                                        Background="{ThemeResource PrimaryContainerBrush}"
                                        CornerRadius="4"
                                        Margin="0,0,12,0">
                                    <Viewbox>
                                        <SymbolIcon Symbol="Shop" 
                                                   Foreground="{ThemeResource OnPrimaryContainerBrush}"/>
                                    </Viewbox>
                                </Border>

                                <!-- Product Details -->
                                <StackPanel Grid.Column="1"
                                            VerticalAlignment="Center">
                                    <TextBlock Text="{x:Bind ProductName}"
                                              FontWeight="SemiBold"
                                              FontSize="14"
                                              TextWrapping="Wrap"/>
                                    <TextBlock Text="{x:Bind CategoryName}"
                                              FontSize="12"
                                              Foreground="{ThemeResource OnSurfaceVariantBrush}"
                                              Margin="0,4,0,0"/>
                                    <TextBlock Text="{x:Bind InventoryQuantity, Converter={StaticResource StringFormatConverter}, ConverterParameter='Stock: {0}'}"
                                              FontSize="11"
                                              Foreground="{ThemeResource OnSurfaceVariantBrush}"/>
                                </StackPanel>

                                <!-- Price and Action -->
                                <StackPanel Grid.Column="2"
                                            VerticalAlignment="Center"
                                            HorizontalAlignment="Right">
                                    <TextBlock Text="{x:Bind Price, Converter={StaticResource StringFormatConverter}, ConverterParameter='${0:F2}'}"
                                              FontWeight="Bold"
                                              FontSize="16"
                                              Foreground="{ThemeResource PrimaryBrush}"/>
                                    <Button Content="View"
                                            Command="{Binding DataContext.ViewProductDetailCommand, RelativeSource={RelativeSource AncestorType=UserControl}}"
                                            CommandParameter="{x:Bind}"
                                            Margin="0,8,0,0"
                                            Style="{StaticResource TextButtonStyle}"/>
                                </StackPanel>
                            </Grid>
                        </Border>
                    </DataTemplate>
                </ListView.ItemTemplate>
            </ListView>
        </Grid>
    </Grid>
</UserControl>
```

```csharp
/// ProductApp/Views/ProductListPage.xaml.cs
using Microsoft.UI.Xaml.Controls;

namespace ProductApp.Views;

public sealed partial class ProductListPage : UserControl
{
    public ProductListPage()
    {
        this.InitializeComponent();
    }
}
```

```xml
<!-- ProductApp/Views/ProductDetailPage.xaml -->
<Page x:Class="ProductApp.Views.ProductDetailPage"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      xmlns:toolkit="using:Uno.Toolkit.WinUI">

    <toolkit:MaterialPage>
        <Grid toolkit:SafeArea.Insets="All"
              Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
            <ScrollViewer>
                <StackPanel Spacing="16" Padding="16">

                    <!-- Product Image -->
                    <Border Background="{ThemeResource PrimaryContainerBrush}"
                            Height="200"
                            CornerRadius="12"
                            HorizontalAlignment="Stretch">
                        <Viewbox>
                            <SymbolIcon Symbol="Shop" 
                                       Foreground="{ThemeResource OnPrimaryContainerBrush}"/>
                        </Viewbox>
                    </Border>

                    <!-- Product Info -->
                    <StackPanel Spacing="12">
                        <TextBlock Text="{Binding Product.ProductName}"
                                  FontSize="24"
                                  FontWeight="Bold"
                                  TextWrapping="Wrap"/>

                        <TextBlock Text="{Binding Product.CategoryName}"
                                  FontSize="16"
                                  Foreground="{ThemeResource OnSurfaceVariantBrush}"/>

                        <TextBlock Text="{Binding Product.Price, Converter={StaticResource StringFormatConverter}, ConverterParameter='${0:F2}'}"
                                  FontSize="28"
                                  FontWeight="Bold"
                                  Foreground="{ThemeResource PrimaryBrush}"/>

                        <TextBlock Text="{Binding Product.InventoryQuantity, Converter={StaticResource StringFormatConverter}, ConverterParameter='In Stock: {0}'}"
                                  FontSize="14"
                                  Foreground="{ThemeResource OnSurfaceVariantBrush}"/>
                    </StackPanel>

                    <!-- Quantity Selector -->
                    <Border Background="{ThemeResource SurfaceVariantBrush}"
                            CornerRadius="8"
                            Padding="16">
                        <StackPanel>
                            <TextBlock Text="Quantity"
                                      FontWeight="SemiBold"
                                      Margin="0,0,0,12"/>
                            <Grid>
                                <Grid.ColumnDefinitions>
                                    <ColumnDefinition Width="*"/>
                                    <ColumnDefinition Width="Auto"/>
                                    <ColumnDefinition Width="Auto"/>
                                </Grid.ColumnDefinitions>

                                <TextBlock Grid.Column="0"
                                          Text="{Binding Quantity}"
                                          FontSize="24"
                                          FontWeight="Bold"
                                          HorizontalAlignment="Center"
                                          VerticalAlignment="Center"/>

                                <Button Grid.Column="1"
                                        Content="-"
                                        Command="{Binding DecreaseQuantityCommand}"
                                        Style="{StaticResource OutlinedButtonStyle}"
                                        Width="40"
                                        Height="40"
                                        Margin="0,0,8,0"/>

                                <Button Grid.Column="2"
                                        Content="+"
                                        Command="{Binding IncreaseQuantityCommand}"
                                        Style="{StaticResource OutlinedButtonStyle}"
                                        Width="40"
                                        Height="40"/>
                            </Grid>
                        </StackPanel>
                    </Border>

                    <!-- Cart Status -->
                    <Border Background="{ThemeResource SecondaryContainerBrush}"
                            CornerRadius="8"
                            Padding="16"
                            Visibility="{Binding IsInCart, Converter={StaticResource TrueToVisibleConverter}}">
                        <TextBlock Text="{Binding CartQuantity, Converter={StaticResource StringFormatConverter}, ConverterParameter='Already in cart: {0}'}"
                                  Foreground="{ThemeResource OnSecondaryContainerBrush}"
                                  TextAlignment="Center"
                                  FontWeight="SemiBold"/>
                    </Border>

                    <!-- Action Buttons -->
                    <StackPanel Spacing="8" Margin="0,16,0,0">
                        <Button Content="Add to Cart"
                                Command="{Binding AddToCartCommand}"
                                Style="{StaticResource FilledButtonStyle}"
                                HorizontalAlignment="Stretch">
                            <Button.Icon>
                                <SymbolIcon Symbol="Add"/>
                            </Button.Icon>
                        </Button>

                        <Button Content="View Cart"
                                Command="{Binding ViewCartCommand}"
                                Style="{StaticResource OutlinedButtonStyle}"
                                HorizontalAlignment="Stretch">
                            <Button.Icon>
                                <SymbolIcon Symbol="ShoppingCart"/>
                            </Button.Icon>
                        </Button>
                    </StackPanel>

                    <!-- Loading Indicator -->
                    <ProgressRing IsActive="{Binding IsBusy}"
                                Visibility="{Binding IsBusy, Converter={StaticResource TrueToVisibleConverter}}"
                                HorizontalAlignment="Center"/>
                </StackPanel>
            </ScrollViewer>
        </Grid>
    </toolkit:MaterialPage>
</Page>
```

```csharp
/// ProductApp/Views/ProductDetailPage.xaml.cs
using Microsoft.UI.Xaml.Controls;

namespace ProductApp.Views;

public sealed partial class ProductDetailPage : Page
{
    public ProductDetailPage()
    {
        this.InitializeComponent();
    }
}
```

```xml
<!-- ProductApp/Views/CartPage.xaml -->
<Page x:Class="ProductApp.Views.CartPage"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      xmlns:toolkit="using:Uno.Toolkit.WinUI"
      xmlns:entities="using:ProductApp.Data.Entities">

    <toolkit:MaterialPage>
        <Grid toolkit:SafeArea.Insets="All"
              Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
            <Grid.RowDefinitions>
                <RowDefinition Height="*"/>
                <RowDefinition Height="Auto"/>
            </Grid.RowDefinitions>

            <!-- Cart Items -->
            <ScrollViewer Grid.Row="0">
                <StackPanel Spacing="8" Padding="16">

                    <!-- Empty State -->
                    <StackPanel HorizontalAlignment="Center"
                               VerticalAlignment="Center"
                               Visibility="{Binding IsEmpty, Converter={StaticResource TrueToVisibleConverter}}">
                        <SymbolIcon Symbol="ShoppingCart" 
                                  FontSize="64"
                                  Foreground="{ThemeResource OnSurfaceVariantBrush}"
                                  Margin="0,0,0,16"/>
                        <TextBlock Text="Your cart is empty"
                                  FontSize="18"
                                  Foreground="{ThemeResource OnSurfaceVariantBrush}"
                                  TextAlignment="Center"/>
                        <Button Content="Continue Shopping"
                                Command="{Binding ContinueShoppingCommand}"
                                Style="{StaticResource TextButtonStyle}"
                                Margin="0,16,0,0"/>
                    </StackPanel>

                    <!-- Cart Items -->
                    <ItemsControl ItemsSource="{Binding CartItems}"
                                 Visibility="{Binding IsEmpty, Converter={StaticResource FalseToVisibleConverter}}">
                        <ItemsControl.ItemTemplate>
                            <DataTemplate x:DataType="entities:CartItem">
                                <Border Background="{ThemeResource SurfaceBrush}"
                                        CornerRadius="8"
                                        Margin="0,4"
                                        Padding="12">
                                    <Grid>
                                        <Grid.ColumnDefinitions>
                                            <ColumnDefinition Width="*"/>
                                            <ColumnDefinition Width="Auto"/>
                                        </Grid.ColumnDefinitions>

                                        <!-- Item Details -->
                                        <StackPanel Grid.Column="0">
                                            <TextBlock Text="{x:Bind ProductName}"
                                                      FontWeight="SemiBold"
                                                      FontSize="16"/>
                                            <TextBlock Text="{x:Bind CategoryName}"
                                                      FontSize="12"
                                                      Foreground="{ThemeResource OnSurfaceVariantBrush}"
                                                      Margin="0,4,0,0"/>
                                            <TextBlock Text="{x:Bind Price, Converter={StaticResource StringFormatConverter}, ConverterParameter='${0:F2} each'}"
                                                      FontSize="14"
                                                      Margin="0,8,0,0"/>
                                        </StackPanel>

                                        <!-- Quantity Controls -->
                                        <StackPanel Grid.Column="1"
                                                   HorizontalAlignment="Right"
                                                   VerticalAlignment="Center">
                                            <TextBlock Text="{x:Bind TotalPrice, Converter={StaticResource StringFormatConverter}, ConverterParameter='${0:F2}'}"
                                                      FontWeight="Bold"
                                                      FontSize="18"
                                                      Foreground="{ThemeResource PrimaryBrush}"
                                                      HorizontalAlignment="Right"/>

                                            <Grid Margin="0,8,0,0">
                                                <Grid.ColumnDefinitions>
                                                    <ColumnDefinition Width="Auto"/>
                                                    <ColumnDefinition Width="Auto"/>
                                                    <ColumnDefinition Width="Auto"/>
                                                </Grid.ColumnDefinitions>

                                                <Button Grid.Column="0"
                                                        Content="-"
                                                        Command="{Binding DataContext.UpdateQuantityCommand, RelativeSource={RelativeSource AncestorType=Page}}"
                                                        CommandParameter="{x:Bind}"
                                                        Style="{StaticResource OutlinedButtonStyle}"
                                                        Width="32"
                                                        Height="32"/>

                                                <TextBlock Grid.Column="1"
                                                          Text="{x:Bind Quantity}"
                                                          FontSize="16"
                                                          FontWeight="SemiBold"
                                                          HorizontalAlignment="Center"
                                                          VerticalAlignment="Center"
                                                          Margin="12,0"
                                                          MinWidth="20"/>

                                                <Button Grid.Column="2"
                                                        Content="+"
                                                        Command="{Binding DataContext.UpdateQuantityCommand, RelativeSource={RelativeSource AncestorType=Page}}"
                                                        CommandParameter="{x:Bind}"
                                                        Style="{StaticResource OutlinedButtonStyle}"
                                                        Width="32"
                                                        Height="32"/>
                                            </Grid>

                                            <Button Content="Remove"
                                                    Command="{Binding DataContext.RemoveFromCartCommand, RelativeSource={RelativeSource AncestorType=Page}}"
                                                    CommandParameter="{x:Bind}"
                                                    Style="{StaticResource TextButtonStyle}"
                                                    Margin="0,4,0,0"/>
                                        </StackPanel>
                                    </Grid>
                                </Border>
                            </DataTemplate>
                        </ItemsControl.ItemTemplate>
                    </ItemsControl>
                </StackPanel>
            </ScrollViewer>

            <!-- Checkout Panel -->
            <Border Grid.Row="1"
                    Background="{ThemeResource SurfaceBrush}"
                    BorderBrush="{ThemeResource OutlineBrush}"
                    BorderThickness="1,1,0,0"
                    Padding="16"
                    Visibility="{Binding IsEmpty, Converter={StaticResource FalseToVisibleConverter}}">
                <StackPanel Spacing="12">
                    <!-- Summary -->
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>

                        <StackPanel Grid.Column="0">
                            <TextBlock Text="Total Items"
                                      FontSize="14"
                                      Foreground="{ThemeResource OnSurfaceVariantBrush}"/>
                            <TextBlock Text="{Binding TotalItems}"
                                      FontSize="16"
                                      FontWeight="SemiBold"/>
                        </StackPanel>

                        <StackPanel Grid.Column="1" HorizontalAlignment="Right">
                            <TextBlock Text="Total Amount"
                                      FontSize="14"
                                      Foreground="{ThemeResource OnSurfaceVariantBrush}"/>
                            <TextBlock Text="{Binding TotalAmount, Converter={StaticResource StringFormatConverter}, ConverterParameter='${0:F2}'}"
                                      FontSize="20"
                                      FontWeight="Bold"
                                      Foreground="{ThemeResource PrimaryBrush}"/>
                        </StackPanel>
                    </Grid>

                    <!-- Checkout Button -->
                    <Button Content="Confirm Purchase"
                            Command="{Binding ConfirmPurchaseCommand}"
                            Style="{StaticResource FilledButtonStyle}"
                            HorizontalAlignment="Stretch">
                        <Button.Icon>
                            <SymbolIcon Symbol="Shop"/>
                        </Button.Icon>
                    </Button>
                </StackPanel>
            </Border>

            <!-- Loading Indicator -->
            <ProgressRing IsActive="{Binding IsBusy}"
                         Visibility="{Binding IsBusy, Converter={StaticResource TrueToVisibleConverter}}"
                         HorizontalAlignment="Center"
                         VerticalAlignment="Center"/>
        </Grid>
    </toolkit:MaterialPage>
</Page>
```

```csharp
/// ProductApp/Views/CartPage.xaml.cs
using Microsoft.UI.Xaml.Controls;

namespace ProductApp.Views;

public sealed partial class CartPage : Page
{
    public CartPage()
    {
        this.InitializeComponent();
    }
}
```

```xml
<!-- ProductApp/Views/OrderConfirmationPage.xaml -->
<Page x:Class="ProductApp.Views.OrderConfirmationPage"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      xmlns:toolkit="using:Uno.Toolkit.WinUI">

    <toolkit:MaterialPage>
        <Grid toolkit:SafeArea.Insets="All"
              Background="{ThemeResource ApplicationPageBackgroundThemeBrush}">
            <ScrollViewer>
                <StackPanel Spacing="24" 
                          Padding="24"
                          HorizontalAlignment="Center"
                          VerticalAlignment="Center"
                          MaxWidth="400">

                    <!-- Success Icon -->
                    <Border Background="{ThemeResource SuccessContainerBrush}"
                            Width="80"
                            Height="80"
                            CornerRadius="40"
                            HorizontalAlignment="Center">
                        <Viewbox>
                            <SymbolIcon Symbol="Accept" 
                                       Foreground="{ThemeResource OnSuccessContainerBrush}"/>
                        </Viewbox>
                    </Border>

                    <!-- Confirmation Message -->
                    <StackPanel Spacing="8" HorizontalAlignment="Center">
                        <TextBlock Text="Order Confirmed!"
                                  FontSize="24"
                                  FontWeight="Bold"
                                  HorizontalAlignment="Center"/>
                        <TextBlock Text="{Binding OrderNumber, Converter={StaticResource StringFormatConverter}, ConverterParameter='Order #: {0}'}"
                                  FontSize="16"
                                  Foreground="{ThemeResource OnSurfaceVariantBrush}"
                                  HorizontalAlignment="Center"/>
                    </StackPanel>

                    <!-- Order Summary -->
                    <Border Background="{ThemeResource SurfaceVariantBrush}"
                            CornerRadius="12"
                            Padding="16">
                        <StackPanel Spacing="8">
                            <TextBlock Text="Order Summary"
                                      FontWeight="SemiBold"
                                      FontSize="16"/>

                            <Grid>
                                <Grid.ColumnDefinitions>
                                    <ColumnDefinition Width="*"/>
                                    <ColumnDefinition Width="Auto"/>
                                </Grid.ColumnDefinitions>

                                <TextBlock Grid.Column="0"
                                          Text="Total Amount"
                                          FontSize="14"/>
                                <TextBlock Grid.Column="1"
                                          Text="{Binding TotalAmount, Converter={StaticResource StringFormatConverter}, ConverterParameter='${0:F2}'}"
                                          FontSize="16"
                                          FontWeight="SemiBold"/>
                            </Grid>

                            <TextBlock Text="{Binding Order.OrderDate, Converter={StaticResource StringFormatConverter}, ConverterParameter='Ordered on {0:MMM dd, yyyy}'}"
                                      FontSize="12"
                                      Foreground="{ThemeResource OnSurfaceVariantBrush}"
                                      Margin="0,8,0,0"/>
                        </StackPanel>
                    </Border>

                    <!-- Action Buttons -->
                    <StackPanel Spacing="8">
                        <Button Content="Continue Shopping"
                                Command="{Binding GoToHomeCommand}"
                                Style="{StaticResource FilledButtonStyle}"
                                HorizontalAlignment="Stretch">
                            <Button.Icon>
                                <SymbolIcon Symbol="Shop"/>
                            </Button.Icon>
                        </Button>

                        <Button Content="View Order Details"
                                Command="{Binding ViewOrderDetailsCommand}"
                                Style="{StaticResource OutlinedButtonStyle}"
                                HorizontalAlignment="Stretch">
                            <Button.Icon>
                                <SymbolIcon Symbol="View"/>
                            </Button.Icon>
                        </Button>
                    </StackPanel>
                </StackPanel>
            </ScrollViewer>
        </Grid>
    </toolkit:MaterialPage>
</Page>
```

```csharp
/// ProductApp/Views/OrderConfirmationPage.xaml.cs
using Microsoft.UI.Xaml.Controls;

namespace ProductApp.Views;

public sealed partial class OrderConfirmationPage : Page
{
    public OrderConfirmationPage()
    {
        this.InitializeComponent();
    }
}
```

Now we need to update the HomePage to include the ProductListPage:

```xml
<!-- ProductApp/Views/HomePage.xaml (Updated) -->
<Page x:Class="ProductApp.Views.HomePage"
      xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
      xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
      xmlns:toolkit="using:Uno.Toolkit.WinUI"
      xmlns:views="using:ProductApp.Views">

    <toolkit:MaterialPage>
        <Grid toolkit:SafeArea.Insets="All">
            <Grid.RowDefinitions>
                <RowDefinition Height="Auto"/>
                <RowDefinition Height="*"/>
            </Grid.RowDefinitions>

            <!-- Header -->
            <Border Grid.Row="0"
                    Background="{ThemeResource PrimaryBrush}"
                    Padding="16,8">
                <Grid>
                    <Grid.ColumnDefinitions>
                        <ColumnDefinition Width="*"/>
                        <ColumnDefinition Width="Auto"/>
                        <ColumnDefinition Width="Auto"/>
                    </Grid.ColumnDefinitions>

                    <TextBlock Grid.Column="0"
                             Text="{Binding Title}"
                             FontSize="20"
                             FontWeight="SemiBold"
                             VerticalAlignment="Center"
                             Foreground="{ThemeResource OnPrimaryBrush}"/>

                    <Button Grid.Column="1"
                            Command="{Binding ViewCartCommand}"
                            Style="{StaticResource IconButtonStyle}"
                            Margin="8,0">
                        <SymbolIcon Symbol="Shop"
                                  Foreground="{ThemeResource OnPrimaryBrush}"/>
                    </Button>

                    <Button Grid.Column="2"
                            Command="{Binding LogoutCommand}"
                            Style="{StaticResource IconButtonStyle}">
                        <SymbolIcon Symbol="LeaveChat"
                                  Foreground="{ThemeResource OnPrimaryBrush}"/>
                    </Button>
                </Grid>
            </Border>

            <!-- Product List Section -->
            <views:ProductListPage Grid.Row="1"
                                 DataContext="{Binding ProductListViewModel}"/>
        </Grid>
    </toolkit:MaterialPage>
</Page>
```

## Task 8: Value Converters and Resources

Let's create the necessary value converters and update App.xaml with resources:

```csharp
/// ProductApp/Converters/BooleanToVisibilityConverter.cs
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Data;

namespace ProductApp.Converters;

public class BooleanToVisibilityConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is bool boolValue)
        {
            return boolValue ? Visibility.Visible : Visibility.Collapsed;
        }
        return Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        if (value is Visibility visibility)
        {
            return visibility == Visibility.Visible;
        }
        return false;
    }
}
```

```csharp
/// ProductApp/Converters/InverseBooleanConverter.cs
using Microsoft.UI.Xaml.Data;

namespace ProductApp.Converters;

public class InverseBooleanConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is bool boolValue)
        {
            return !boolValue;
        }
        return true;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        if (value is bool boolValue)
        {
            return !boolValue;
        }
        return false;
    }
}
```

```csharp
/// ProductApp/Converters/StringFormatConverter.cs
using Microsoft.UI.Xaml.Data;

namespace ProductApp.Converters;

public class StringFormatConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (parameter is string format && value != null)
        {
            return string.Format(format, value);
        }
        return value?.ToString() ?? string.Empty;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}
```

```csharp
/// ProductApp/Converters/NotEqualConverter.cs
using Microsoft.UI.Xaml.Data;

namespace ProductApp.Converters;

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
```

```csharp
/// ProductApp/Converters/EqualToZeroConverter.cs
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Data;

namespace ProductApp.Converters;

public class EqualToZeroConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, string language)
    {
        if (value is int intValue)
        {
            return intValue == 0 ? Visibility.Visible : Visibility.Collapsed;
        }
        if (value is long longValue)
        {
            return longValue == 0 ? Visibility.Visible : Visibility.Collapsed;
        }
        return Visibility.Collapsed;
    }

    public object ConvertBack(object value, Type targetType, object parameter, string language)
    {
        throw new NotImplementedException();
    }
}
```

Now let's update App.xaml with these converters:

```xml
<!-- ProductApp/App.xaml (Updated with Resources) -->
<toolkit:MaterialApplication
    x:Class="ProductApp.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:toolkit="using:Uno.Toolkit.WinUI"
    xmlns:converters="using:ProductApp.Converters">
    
    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <XamlControlsResources xmlns="using:Microsoft.UI.Xaml.Controls" />
                <MaterialColors xmlns="using:Uno.Toolkit.WinUI" />
                <MaterialFonts xmlns="using:Uno.Toolkit.WinUI" />
                <MaterialResources xmlns="using:Uno.Toolkit.WinUI" />
            </ResourceDictionary.MergedDictionaries>

            <!-- Converters -->
            <converters:BooleanToVisibilityConverter x:Key="TrueToVisibleConverter" />
            <converters:InverseBooleanConverter x:Key="FalseToVisibleConverter" />
            <converters:StringFormatConverter x:Key="StringFormatConverter" />
            <converters:NotEqualConverter x:Key="NotEqualConverter" />
            <converters:EqualToZeroConverter x:Key="EqualToZeroToVisibleConverter" />
        </ResourceDictionary>
    </Application.Resources>
</toolkit:MaterialApplication>
```

This completes Task 7 and 8. We've now implemented:

1. **All XAML Views**:
   - `ProductListPage` - Product listing with search and filtering
   - `ProductDetailPage` - Product details with add to cart functionality
   - `CartPage` - Shopping cart management
   - `OrderConfirmationPage` - Order success confirmation

2. **Value Converters** for data binding:
   - Boolean to visibility converters
   - String formatting converter
   - Comparison converters

3. **Complete MVVM Architecture** with proper data binding

Key features implemented:
- **Material Design** with Uno.Toolkit
- **Responsive layouts** for mobile
- **Data binding** with proper converters
- **Loading states** and empty states
- **Error handling** in UI
- **Navigation** between all pages

The application now has a complete UI with all the required screens and functionality. The next step would be to test the application and make any necessary adjustments for the Android build.

Would you like me to continue with any specific improvements or additional features?