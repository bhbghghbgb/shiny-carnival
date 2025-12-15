using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Controls.Primitives;
using Microsoft.UI.Xaml.Data;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Navigation;
using UnoApp3.Models.Product;
using UnoApp3.ViewModels;

namespace UnoApp3.Views;

public sealed partial class ProductListPage : Page
{
    private bool _hasLoadedProducts;

    public ProductListViewModel? ViewModel => DataContext as ProductListViewModel;

    public ProductListPage()
    {
        this.InitializeComponent();
        this.DataContextChanged += OnDataContextChanged;
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);

        this.Log().LogDebug($"ProductListPage.OnNavigatedTo - DataContext is null: {DataContext == null}");

        // If the ViewModel is already available, trigger the load.
        if (ViewModel != null && !_hasLoadedProducts)
        {
            this.Log().LogDebug("DataContext available immediately, loading products");
            _ = LoadProductsWhenReady();
        }
        else if (ViewModel == null)
        {
            this.Log().LogDebug("DataContext not ready, will wait for DataContextChanged");
        }
    }

    private async void OnDataContextChanged(FrameworkElement sender, DataContextChangedEventArgs args)
    {
        this.Log().LogDebug(
            $"ProductListPage.DataContextChanged - New DataContext type: {args.NewValue?.GetType().Name}");

        if (ViewModel != null && !_hasLoadedProducts)
        {
            this.Log().LogDebug("ProductListViewModel now available, loading products");
            await LoadProductsWhenReady();
        }
    }

    private async Task LoadProductsWhenReady()
    {
        // Wait up to 5 seconds for ViewModel
        int attempts = 0;
        const int maxAttempts = 50;

        while (ViewModel == null && attempts < maxAttempts)
        {
            this.Log().LogDebug($"Waiting for ProductListViewModel... Attempt {attempts + 1}");
            await Task.Delay(100);
            attempts++;
        }

        if (ViewModel != null)
        {
            this.Log().LogDebug($"ViewModel ready after {attempts * 100}ms, executing LoadProductsCommand");

            // Only load once per navigation
            _hasLoadedProducts = true;

            // Trigger the view model load command
            await ViewModel.LoadProducts();
        }
        else
        {
            this.Log().LogDebug($"ERROR: ProductListViewModel still null after {maxAttempts * 100}ms!");
        }
    }

    protected override void OnNavigatedFrom(NavigationEventArgs e)
    {
        base.OnNavigatedFrom(e);
        this.DataContextChanged -= OnDataContextChanged;
        _hasLoadedProducts = false; // Reset for next navigation
    }

    private void ListView_ItemClick(object sender, ItemClickEventArgs e)
    {
        if (e.ClickedItem is ProductListDto product)
        {
            ViewModel?.ViewProductDetailCommand.Execute(product);
        }
    }
}
