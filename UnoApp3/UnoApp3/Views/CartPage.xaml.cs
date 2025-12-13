using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Navigation;
using UnoApp3.ViewModels;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace UnoApp3.Views;

/// <summary>
/// An empty page that can be used on its own or navigated to within a Frame.
/// </summary>
public sealed partial class CartPage : Page
{
    public CartPage()
    {
        this.InitializeComponent();
        this.Loaded += CartPage_Loaded;
    }

    private async void CartPage_Loaded(object sender, RoutedEventArgs e)
    {
        if (DataContext is CartViewModel vm)
        {
            await vm.LoadCartCommand.ExecuteAsync(null);
        }
    }
}

