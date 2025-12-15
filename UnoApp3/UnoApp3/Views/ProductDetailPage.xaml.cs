using UnoApp3.ViewModels;

namespace UnoApp3.Views;

public sealed partial class ProductDetailPage : Page
{
    private int? _pendingProductId;

    public ProductDetailViewModel? ViewModel => DataContext as ProductDetailViewModel;

    public ProductDetailPage()
    {
        this.InitializeComponent();
        this.DataContextChanged += OnDataContextChanged;
    }

    protected override void OnNavigatedTo(NavigationEventArgs e)
    {
        base.OnNavigatedTo(e);

        this.Log().LogDebug($"OnNavigatedTo - Parameter type: {e.Parameter?.GetType().Name}");
        this.Log().LogDebug($"OnNavigatedTo - DataContext is null: {DataContext == null}");

        // Extract productId from different parameter types
        if (e.Parameter is int productId)
        {
            _pendingProductId = productId;
            this.Log().LogDebug($"Received productId: {productId}");
        }
        else if (e.Parameter is IDictionary<string, object> dict &&
                 dict.TryGetValue("productId", out var idObj))
        {
            if (idObj is int id)
            {
                _pendingProductId = id;
                this.Log().LogDebug($"Received productId from dict: {id}");
            }
        }

        // Try to load immediately if DataContext is available
        if (ViewModel != null && _pendingProductId.HasValue)
        {
            this.Log().LogDebug("DataContext available immediately, loading product");
            _ = LoadProductWhenReady(_pendingProductId.Value);
        }
        else
        {
            this.Log().LogDebug("DataContext not ready, will wait");
        }
    }

    private async void OnDataContextChanged(FrameworkElement sender, DataContextChangedEventArgs args)
    {
        this.Log().LogDebug(
            $"DataContextChanged - New DataContext type: {args.NewValue?.GetType().Name}");

        if (ViewModel != null && _pendingProductId.HasValue)
        {
            this.Log().LogDebug($"DataContext now available, loading product {_pendingProductId.Value}");
            await LoadProductWhenReady(_pendingProductId.Value);
            _pendingProductId = null; // Clear so we don't load again
        }
    }

    private async Task LoadProductWhenReady(int productId)
    {
        // Wait up to 5 seconds for ViewModel to be available
        var maxAttempts = 50; // 50 * 100ms = 5 seconds
        var attempts = 0;

        while (ViewModel == null && attempts < maxAttempts)
        {
            this.Log().LogDebug($"Waiting for ViewModel... Attempt {attempts + 1}");
            await Task.Delay(100);
            attempts++;
        }

        if (ViewModel != null)
        {
            this.Log().LogDebug(
                $"ViewModel ready after {attempts * 100}ms, loading product {productId}");
            var data = new Dictionary<string, object>
            {
                ["productId"] = productId
            };
            await ViewModel.OnNavigatedTo(data);
        }
        else
        {
            this.Log().LogDebug($"ERROR: ViewModel still null after {maxAttempts * 100}ms!");
        }
    }

    protected override void OnNavigatedFrom(NavigationEventArgs e)
    {
        base.OnNavigatedFrom(e);
        this.DataContextChanged -= OnDataContextChanged;
    }
}
