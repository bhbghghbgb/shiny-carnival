## Task 2: Database Setup and Data Layer

Let's implement the database layer with Entity Framework Core and SQLite.

```csharp
/// ProductApp/Data/Entities/CartItem.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductApp.Data.Entities;

public class CartItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public int ProductId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string ProductName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }
    
    public int Quantity { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    
    [NotMapped]
    public decimal TotalPrice => Price * Quantity;
}
```

```csharp
/// ProductApp/Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using ProductApp.Data.Entities;

namespace ProductApp.Data;

public class AppDbContext : DbContext
{
    public DbSet<CartItem> CartItems { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string databasePath = Path.Combine(FileSystem.AppDataDirectory, "productapp.db3");
        optionsBuilder.UseSqlite($"Data Source={databasePath}");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CategoryName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.AddedAt).IsRequired();
        });
    }
}
```

```csharp
/// ProductApp/Data/Repositories/ICartRepository.cs
using ProductApp.Data.Entities;

namespace ProductApp.Data.Repositories;

public interface ICartRepository
{
    Task<List<CartItem>> GetAllAsync();
    Task<CartItem?> GetByProductIdAsync(int productId);
    Task<CartItem> AddOrUpdateAsync(CartItem cartItem);
    Task RemoveAsync(int cartItemId);
    Task RemoveByProductIdAsync(int productId);
    Task ClearAllAsync();
    Task<int> GetTotalCountAsync();
}
```

```csharp
/// ProductApp/Data/Repositories/CartRepository.cs
using Microsoft.EntityFrameworkCore;
using ProductApp.Data.Entities;

namespace ProductApp.Data.Repositories;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CartItem>> GetAllAsync()
    {
        return await _context.CartItems
            .OrderByDescending(x => x.AddedAt)
            .ToListAsync();
    }

    public async Task<CartItem?> GetByProductIdAsync(int productId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(x => x.ProductId == productId);
    }

    public async Task<CartItem> AddOrUpdateAsync(CartItem cartItem)
    {
        var existingItem = await GetByProductIdAsync(cartItem.ProductId);
        
        if (existingItem != null)
        {
            existingItem.Quantity += cartItem.Quantity;
            _context.CartItems.Update(existingItem);
            await _context.SaveChangesAsync();
            return existingItem;
        }
        else
        {
            cartItem.AddedAt = DateTime.UtcNow;
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }
    }

    public async Task RemoveAsync(int cartItemId)
    {
        var item = await _context.CartItems.FindAsync(cartItemId);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveByProductIdAsync(int productId)
    {
        var item = await GetByProductIdAsync(productId);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearAllAsync()
    {
        _context.CartItems.RemoveRange(_context.CartItems);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.CartItems.SumAsync(x => x.Quantity);
    }
}
```

## Task 3: API Services and Interfaces

Now let's implement the API interfaces and services.

```csharp
/// ProductApp/Core/Services/IAuthApi.cs
using ProductApp.Models;
using Refit;

namespace ProductApp.Core.Services;

public interface IAuthApi
{
    [Post("/api/auth/login")]
    Task<LoginResponse> LoginAsync([Body] LoginRequest request);
}
```

```csharp
/// ProductApp/Core/Services/IProductApi.cs
using ProductApp.Models;
using Refit;

namespace ProductApp.Core.Services;

public interface IProductApi
{
    [Get("/api/products")]
    Task<List<ProductListDto>> GetProductsAsync();
}
```

```csharp
/// ProductApp/Core/Services/IOrderApi.cs
using ProductApp.Models;
using Refit;

namespace ProductApp.Core.Services;

public interface IOrderApi
{
    [Post("/api/orders")]
    Task<OrderResponseDto> CreateOrderAsync([Body] CreateOrderRequest request);
}
```

```csharp
/// ProductApp/Models/OrderResponseDto.cs
namespace ProductApp.Models;

public class OrderResponseDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string StaffName { get; set; } = string.Empty;
    public int? PromoId { get; set; }
    public string? PromoCode { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
}
```

```csharp
/// ProductApp/Core/Services/IAuthService.cs
using ProductApp.Models;

namespace ProductApp.Core.Services;

public interface IAuthService
{
    Task<bool> LoginAsync(string username, string password);
    Task<bool> IsAuthenticatedAsync();
    Task LogoutAsync();
    string? GetToken();
}

public class AuthService : IAuthService
{
    private readonly IAuthApi _authApi;
    private string? _token;

    public AuthService(IAuthApi authApi)
    {
        _authApi = authApi;
    }

    public async Task<bool> LoginAsync(string username, string password)
    {
        try
        {
            var request = new LoginRequest { Username = username, Password = password };
            var response = await _authApi.LoginAsync(request);
            _token = response.Token;
            return true;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Login failed: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> IsAuthenticatedAsync()
    {
        return !string.IsNullOrEmpty(_token);
    }

    public async Task LogoutAsync()
    {
        _token = null;
    }

    public string? GetToken()
    {
        return _token;
    }
}
```

```csharp
/// ProductApp/Core/Services/IProductService.cs
using ProductApp.Models;

namespace ProductApp.Core.Services;

public interface IProductService
{
    Task<List<ProductListDto>> GetProductsAsync();
    Task<List<ProductListDto>> SearchProductsAsync(string searchTerm);
    Task<List<ProductListDto>> GetProductsByCategoryAsync(string category);
}

public class ProductService : IProductService
{
    private readonly IProductApi _productApi;

    public ProductService(IProductApi productApi)
    {
        _productApi = productApi;
    }

    public async Task<List<ProductListDto>> GetProductsAsync()
    {
        try
        {
            return await _productApi.GetProductsAsync();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to get products: {ex.Message}");
            return GetSampleProducts(); // Fallback to sample data
        }
    }

    public async Task<List<ProductListDto>> SearchProductsAsync(string searchTerm)
    {
        var products = await GetProductsAsync();
        return products.Where(p => 
            p.ProductName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
            p.CategoryName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<List<ProductListDto>> GetProductsByCategoryAsync(string category)
    {
        var products = await GetProductsAsync();
        return products.Where(p => 
            p.CategoryName.Equals(category, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    private List<ProductListDto> GetSampleProducts()
    {
        return new List<ProductListDto>
        {
            new ProductListDto { Id = 1, ProductName = "Laptop", Price = 999.99m, CategoryName = "Electronics", InventoryQuantity = 10 },
            new ProductListDto { Id = 2, ProductName = "Mouse", Price = 29.99m, CategoryName = "Electronics", InventoryQuantity = 50 },
            new ProductListDto { Id = 3, ProductName = "Notebook", Price = 4.99m, CategoryName = "Stationery", InventoryQuantity = 100 },
            new ProductListDto { Id = 4, ProductName = "Pen", Price = 1.99m, CategoryName = "Stationery", InventoryQuantity = 200 }
        };
    }
}
```

```csharp
/// ProductApp/Core/Services/IOrderService.cs
using ProductApp.Models;

namespace ProductApp.Core.Services;

public interface IOrderService
{
    Task<OrderResponseDto?> CreateOrderAsync(CreateOrderRequest request);
}

public class OrderService : IOrderService
{
    private readonly IOrderApi _orderApi;
    private readonly IAuthService _authService;

    public OrderService(IOrderApi orderApi, IAuthService authService)
    {
        _orderApi = orderApi;
        _authService = authService;
    }

    public async Task<OrderResponseDto?> CreateOrderAsync(CreateOrderRequest request)
    {
        try
        {
            return await _orderApi.CreateOrderAsync(request);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to create order: {ex.Message}");
            return null;
        }
    }
}
```

## Task 4: ViewModels Base and Common Classes

Let's create the base ViewModel and common utilities.

```csharp
/// ProductApp/Core/ViewModels/ViewModelBase.cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class ViewModelBase : ObservableObject
{
    [ObservableProperty]
    private bool _isBusy;

    [ObservableProperty]
    private string _title = string.Empty;

    protected readonly INavigator Navigator;

    public ViewModelBase(INavigator navigator)
    {
        Navigator = navigator;
    }

    [RelayCommand]
    private async Task GoBackAsync()
    {
        await Navigator.GoBackAsync(this);
    }
}
```

```csharp
/// ProductApp/Core/Utilities/ImageHelper.cs
using Microsoft.UI.Xaml.Media.Imaging;

namespace ProductApp.Core.Utilities;

public static class ImageHelper
{
    public static async Task<BitmapImage?> LoadProductImageAsync(int productId, string baseUrl = "http://10.0.2.2:5000")
    {
        try
        {
            var imageUrl = $"{baseUrl}/images/product/{productId}.png";
            var bitmapImage = new BitmapImage();
            await bitmapImage.SetSourceAsync(new Uri(imageUrl));
            return bitmapImage;
        }
        catch (Exception)
        {
            // Return null if image fails to load - we'll handle this in XAML
            return null;
        }
    }

    public static BitmapImage GetDefaultProductImage()
    {
        return new BitmapImage(new Uri("ms-appx:///Assets/default-product.png"));
    }

    public static BitmapImage GetErrorImage()
    {
        return new BitmapImage(new Uri("ms-appx:///Assets/error-image.png"));
    }
}
```

This completes Task 2. We've now implemented:

1. **Database Layer** with Entity Framework Core and SQLite
   - CartItem entity
   - AppDbContext with SQLite configuration
   - CartRepository with CRUD operations

2. **API Services** with Refit interfaces
   - IAuthApi, IProductApi, IOrderApi
   - AuthService, ProductService, OrderService implementations
   - Error handling and fallback to sample data

3. **Common Infrastructure**
   - ViewModelBase with common functionality
   - ImageHelper for lazy loading product images
   - Proper error handling for API calls

Key features:
- SQLite database for offline cart storage
- Refit API clients with proper error handling
- Sample data fallback for development
- Image loading with error handling
- Android localhost configuration (10.0.2.2)

Would you like me to continue with Task 5: Implementing the ViewModels?<｜end▁of▁thinking｜>## Task 5: ViewModels Implementation

Let's implement all the ViewModels for our MVVM architecture.

```csharp
/// ProductApp/Core/ViewModels/LoginViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class LoginViewModel : ViewModelBase
{
    private readonly IAuthService _authService;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string _username = string.Empty;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string _password = string.Empty;

    [ObservableProperty]
    private string _errorMessage = string.Empty;

    [ObservableProperty]
    private bool _showError;

    public LoginViewModel(INavigator navigator, IAuthService authService) 
        : base(navigator)
    {
        _authService = authService;
        Title = "Login";
    }

    private bool CanLogin => !string.IsNullOrWhiteSpace(Username) && 
                           !string.IsNullOrWhiteSpace(Password) && 
                           !IsBusy;

    [RelayCommand(CanExecute = nameof(CanLogin))]
    private async Task LoginAsync()
    {
        IsBusy = true;
        ShowError = false;
        ErrorMessage = string.Empty;

        try
        {
            var success = await _authService.LoginAsync(Username, Password);
            
            if (success)
            {
                await Navigator.NavigateViewModelAsync<HomeViewModel>(this);
            }
            else
            {
                ErrorMessage = "Invalid username or password";
                ShowError = true;
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Login failed: {ex.Message}";
            ShowError = true;
        }
        finally
        {
            IsBusy = false;
        }
    }

    protected override void OnPropertyChanged(System.ComponentModel.PropertyChangedEventArgs e)
    {
        base.OnPropertyChanged(e);
        
        if (e.PropertyName == nameof(Username) || 
            e.PropertyName == nameof(Password) || 
            e.PropertyName == nameof(IsBusy))
        {
            LoginCommand.NotifyCanExecuteChanged();
        }
    }
}
```

```csharp
/// ProductApp/Core/ViewModels/HomeViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class HomeViewModel : ViewModelBase
{
    private readonly IProductService _productService;

    [ObservableProperty]
    private List<ProductListDto> _products = new();

    [ObservableProperty]
    private List<ProductListDto> _filteredProducts = new();

    [ObservableProperty]
    private List<string> _categories = new();

    [ObservableProperty]
    private string _selectedCategory = "All";

    [ObservableProperty]
    private string _searchText = string.Empty;

    [ObservableProperty]
    private bool _showSearchResults;

    public HomeViewModel(INavigator navigator, IProductService productService) 
        : base(navigator)
    {
        _productService = productService;
        Title = "Products";
    }

    public override async Task OnNavigatedToAsync()
    {
        await LoadProductsAsync();
    }

    [RelayCommand]
    private async Task LoadProductsAsync()
    {
        IsBusy = true;
        
        try
        {
            Products = await _productService.GetProductsAsync();
            UpdateCategories();
            ApplyFilters();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load products: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ViewProductDetailAsync(ProductListDto product)
    {
        if (product != null)
        {
            var parameters = new Dictionary<string, object> { ["Product"] = product };
            await Navigator.NavigateViewModelAsync<ProductDetailViewModel>(this, data: parameters);
        }
    }

    [RelayCommand]
    private void SearchProducts()
    {
        ApplyFilters();
        ShowSearchResults = !string.IsNullOrWhiteSpace(SearchText);
    }

    [RelayCommand]
    private void ClearSearch()
    {
        SearchText = string.Empty;
        ShowSearchResults = false;
        ApplyFilters();
    }

    [RelayCommand]
    private void FilterByCategory(string category)
    {
        SelectedCategory = category;
        ApplyFilters();
    }

    private void UpdateCategories()
    {
        var allCategories = Products
            .Select(p => p.CategoryName)
            .Distinct()
            .OrderBy(c => c)
            .ToList();
        
        Categories = new List<string> { "All" }.Concat(allCategories).ToList();
    }

    private void ApplyFilters()
    {
        var filtered = Products.AsEnumerable();

        // Apply category filter
        if (!string.IsNullOrEmpty(SelectedCategory) && SelectedCategory != "All")
        {
            filtered = filtered.Where(p => p.CategoryName == SelectedCategory);
        }

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(SearchText))
        {
            filtered = filtered.Where(p => 
                p.ProductName.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                p.CategoryName.Contains(SearchText, StringComparison.OrdinalIgnoreCase));
        }

        FilteredProducts = filtered.ToList();
    }

    partial void OnSearchTextChanged(string value)
    {
        ApplyFilters();
        ShowSearchResults = !string.IsNullOrWhiteSpace(value);
    }

    partial void OnSelectedCategoryChanged(string value)
    {
        ApplyFilters();
    }
}
```

```csharp
/// ProductApp/Core/ViewModels/ProductDetailViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using ProductApp.Data.Entities;
using ProductApp.Data.Repositories;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class ProductDetailViewModel : ViewModelBase
{
    private readonly ICartRepository _cartRepository;

    [ObservableProperty]
    private ProductListDto? _product;

    [ObservableProperty]
    private int _quantity = 1;

    [ObservableProperty]
    private bool _isInCart;

    [ObservableProperty]
    private int _cartQuantity;

    public ProductDetailViewModel(INavigator navigator, ICartRepository cartRepository) 
        : base(navigator)
    {
        _cartRepository = cartRepository;
    }

    public override async Task OnNavigatedToAsync()
    {
        await LoadProductDataAsync();
    }

    [RelayCommand]
    private async Task LoadProductDataAsync()
    {
        if (NavigationData is Dictionary<string, object> data && 
            data.TryGetValue("Product", out var productObj) && 
            productObj is ProductListDto product)
        {
            Product = product;
            Title = product.ProductName;
            await CheckCartStatusAsync();
        }
    }

    [RelayCommand]
    private async Task AddToCartAsync()
    {
        if (Product == null) return;

        IsBusy = true;

        try
        {
            var cartItem = new CartItem
            {
                ProductId = Product.Id,
                ProductName = Product.ProductName,
                CategoryName = Product.CategoryName,
                Price = Product.Price,
                Quantity = Quantity
            };

            await _cartRepository.AddOrUpdateAsync(cartItem);
            await CheckCartStatusAsync();
            
            // Show success message or navigate to cart
            await Navigator.NavigateViewModelAsync<CartViewModel>(this);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to add to cart: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ViewCartAsync()
    {
        await Navigator.NavigateViewModelAsync<CartViewModel>(this);
    }

    [RelayCommand]
    private void IncreaseQuantity()
    {
        Quantity++;
    }

    [RelayCommand]
    private void DecreaseQuantity()
    {
        if (Quantity > 1)
        {
            Quantity--;
        }
    }

    private async Task CheckCartStatusAsync()
    {
        if (Product != null)
        {
            var cartItem = await _cartRepository.GetByProductIdAsync(Product.Id);
            IsInCart = cartItem != null;
            CartQuantity = cartItem?.Quantity ?? 0;
        }
    }
}
```

```csharp
/// ProductApp/Core/ViewModels/CartViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using ProductApp.Data.Entities;
using ProductApp.Data.Repositories;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class CartViewModel : ViewModelBase
{
    private readonly ICartRepository _cartRepository;
    private readonly IOrderService _orderService;

    [ObservableProperty]
    private List<CartItem> _cartItems = new();

    [ObservableProperty]
    private decimal _totalAmount;

    [ObservableProperty]
    private int _totalItems;

    [ObservableProperty]
    private bool _isEmpty = true;

    public CartViewModel(INavigator navigator, ICartRepository cartRepository, IOrderService orderService) 
        : base(navigator)
    {
        _cartRepository = cartRepository;
        _orderService = orderService;
        Title = "Shopping Cart";
    }

    public override async Task OnNavigatedToAsync()
    {
        await LoadCartAsync();
    }

    [RelayCommand]
    private async Task LoadCartAsync()
    {
        IsBusy = true;
        
        try
        {
            CartItems = await _cartRepository.GetAllAsync();
            CalculateTotals();
            IsEmpty = !CartItems.Any();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load cart: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task UpdateQuantityAsync(CartItem cartItem)
    {
        if (cartItem.Quantity <= 0)
        {
            await RemoveFromCartAsync(cartItem);
        }
        else
        {
            await _cartRepository.AddOrUpdateAsync(cartItem);
            CalculateTotals();
        }
    }

    [RelayCommand]
    private async Task RemoveFromCartAsync(CartItem cartItem)
    {
        try
        {
            await _cartRepository.RemoveAsync(cartItem.Id);
            CartItems.Remove(cartItem);
            CalculateTotals();
            IsEmpty = !CartItems.Any();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to remove from cart: {ex.Message}");
        }
    }

    [RelayCommand]
    private async Task ConfirmPurchaseAsync()
    {
        if (!CartItems.Any()) return;

        IsBusy = true;

        try
        {
            var orderRequest = new CreateOrderRequest
            {
                CustomerId = 1, // Default customer for demo
                OrderItems = CartItems.Select(ci => new OrderItemInput
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity
                }).ToList()
            };

            var orderResponse = await _orderService.CreateOrderAsync(orderRequest);
            
            if (orderResponse != null)
            {
                // Clear cart and navigate to confirmation
                await _cartRepository.ClearAllAsync();
                
                var parameters = new Dictionary<string, object> 
                { 
                    ["Order"] = orderResponse 
                };
                await Navigator.NavigateViewModelAsync<OrderConfirmationViewModel>(this, data: parameters);
            }
            else
            {
                // Handle order failure
                System.Diagnostics.Debug.WriteLine("Order creation failed");
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Purchase failed: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ContinueShoppingAsync()
    {
        await Navigator.GoBackAsync(this);
    }

    private void CalculateTotals()
    {
        TotalItems = CartItems.Sum(ci => ci.Quantity);
        TotalAmount = CartItems.Sum(ci => ci.TotalPrice);
    }
}
```

```csharp
/// ProductApp/Core/ViewModels/OrderConfirmationViewModel.cs
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class OrderConfirmationViewModel : ViewModelBase
{
    [ObservableProperty]
    private OrderResponseDto? _order;

    [ObservableProperty]
    private string _orderNumber = string.Empty;

    [ObservableProperty]
    private decimal _totalAmount;

    public OrderConfirmationViewModel(INavigator navigator) 
        : base(navigator)
    {
        Title = "Order Confirmation";
    }

    public override Task OnNavigatedToAsync()
    {
        if (NavigationData is Dictionary<string, object> data && 
            data.TryGetValue("Order", out var orderObj) && 
            orderObj is OrderResponseDto order)
        {
            Order = order;
            OrderNumber = $"ORD-{order.Id:D6}";
            TotalAmount = order.FinalAmount;
        }

        return Task.CompletedTask;
    }

    [RelayCommand]
    private async Task GoToHomeAsync()
    {
        await Navigator.NavigateViewModelAsync<HomeViewModel>(this);
    }

    [RelayCommand]
    private async Task ViewOrderDetailsAsync()
    {
        // In a real app, you might navigate to an order details page
        // For now, just show a message
        System.Diagnostics.Debug.WriteLine($"Viewing order details for {OrderNumber}");
    }
}
```

This completes Task 5. We've implemented all the ViewModels:

1. **LoginViewModel** - Handles user authentication with validation
2. **HomeViewModel** - Manages product listing with search and filtering
3. **ProductDetailViewModel** - Handles product details and cart operations
4. **CartViewModel** - Manages shopping cart operations and purchase flow
5. **OrderConfirmationViewModel** - Shows order confirmation details

Key features implemented:
- **MVVM pattern** with CommunityToolkit.Mvvm
- **Navigation** between views using Uno.Extensions.Navigation
- **Data binding** with ObservableProperty and RelayCommand
- **Error handling** and loading states
- **Cart management** with quantity updates
- **Order processing** flow

The ViewModels are now ready to be bound to the XAML views. Would you like me to continue with Task 6: Implementing the XAML Views?