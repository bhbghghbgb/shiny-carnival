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
        private bool _hasLoadedCart;

        public CartViewModel? ViewModel => DataContext as CartViewModel;

        public CartPage()
        {
            this.InitializeComponent();
            this.DataContextChanged += OnDataContextChanged;
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            this.Log().LogDebug($"CartPage.OnNavigatedTo - DataContext is null: {DataContext == null}");

            // If the ViewModel is already available, trigger the load.
            if (ViewModel != null && !_hasLoadedCart)
            {
                this.Log().LogDebug("DataContext available immediately, loading cart");
                _ = LoadCartWhenReady();
            }
            else if (ViewModel == null)
            {
                this.Log().LogDebug("DataContext not ready, will wait for DataContextChanged");
            }
        }

        private async void OnDataContextChanged(FrameworkElement sender, DataContextChangedEventArgs args)
        {
            this.Log().LogDebug(
                $"CartPage.DataContextChanged - New DataContext type: {args.NewValue?.GetType().Name}");

            if (ViewModel != null && !_hasLoadedCart)
            {
                this.Log().LogDebug("CartViewModel now available, loading cart");
                await LoadCartWhenReady();
            }
        }

        private async Task LoadCartWhenReady()
        {
            // Wait up to 5 seconds for ViewModel (optional if needed)
            int attempts = 0;
            const int maxAttempts = 50; // 50 * 100ms = 5000ms

            while (ViewModel == null && attempts < maxAttempts)
            {
                this.Log().LogDebug($"Waiting for CartViewModel... Attempt {attempts + 1}");
                await Task.Delay(100);
                attempts++;
            }

            if (ViewModel != null)
            {
                this.Log().LogDebug($"ViewModel ready after {attempts * 100}ms, executing LoadCartCommand");

                // Only load once per navigation
                _hasLoadedCart = true;

                // Trigger the view model load command
                ViewModel.LoadCartCommand.Execute(null);
            }
            else
            {
                this.Log().LogDebug($"ERROR: CartViewModel still null after {maxAttempts * 100}ms!");
            }
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);
            this.DataContextChanged -= OnDataContextChanged;
        }
    }
