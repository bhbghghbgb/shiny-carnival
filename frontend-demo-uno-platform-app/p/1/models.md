Project Path: Models

Source Tree:

```txt
Models
├── Authentication
│   ├── LoginRequest.cs
│   ├── LoginResponse.cs
│   ├── LogoutRequest.cs
│   ├── RefreshTokenRequest.cs
│   └── UserDto.cs
├── Category
│   ├── CategoryResponseDto.cs
│   ├── CreateCategoryRequest.cs
│   └── UpdateCategoryRequest.cs
├── Common
│   ├── BasePagedRequest.cs
│   ├── CategorySearchRequest.cs
│   ├── CustomerSearchRequest.cs
│   ├── InventorySearchRequest.cs
│   ├── OrderSearchRequest.cs
│   ├── PagedRequest.cs
│   ├── ProductSearchRequest.cs
│   ├── PromotionSearchRequest.cs
│   ├── SupplierSearchRequest.cs
│   └── UserSearchRequest.cs
├── Customer
│   ├── CreateCustomerRequest.cs
│   ├── CustomerListDto.cs
│   ├── CustomerResponseDto.cs
│   └── UpdateCustomerRequest.cs
├── Inventory
│   ├── InventoryHistoryDto.cs
│   ├── InventoryResponseDto.cs
│   ├── LowStockAlertDto.cs
│   └── UpdateInventoryRequest.cs
├── Order
│   ├── AddOrderItemRequest.cs
│   ├── CreateOrderRequest.cs
│   ├── OrderDetailsDto.cs
│   ├── OrderItemDto.cs
│   ├── OrderItemInput.cs
│   ├── OrderItemResponseDto.cs
│   ├── OrderListDto.cs
│   ├── OrderResponseDto.cs
│   ├── PaymentDto.cs
│   ├── UpdateOrderItemRequest.cs
│   └── UpdateOrderStatusRequest.cs
├── Product
│   ├── CreateProductRequest.cs
│   ├── ProductListDto.cs
│   ├── ProductResponseDto.cs
│   └── UpdateProductRequest.cs
├── Promotion
│   ├── CreatePromotionRequest.cs
│   ├── PromotionListDto.cs
│   ├── PromotionResponseDto.cs
│   ├── UpdatePromotionRequest.cs
│   ├── ValidatePromoRequest.cs
│   └── ValidatePromoResponse.cs
├── Supplier
│   ├── CreateSupplierRequest.cs
│   ├── SupplierResponseDto.cs
│   └── UpdateSupplierRequest.cs
└── User
    ├── CreateUserRequest.cs
    ├── UpdateUserRequest.cs
    └── UserResponseDto.cs

```

`Authentication\LoginRequest.cs`:

```cs
namespace RetailStoreManagement.Models;

public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
```

`Authentication\LoginResponse.cs`:

```cs
using RetailStoreManagement.Models.Authentication;

namespace RetailStoreManagement.Models;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}
```

`Authentication\LogoutRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Authentication
{
    public class LogoutRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}


```

`Authentication\RefreshTokenRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Authentication
{
    public class RefreshTokenRequest
    {
        [Required]
        public string AccessToken { get; set; } = string.Empty;

        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}


```

`Authentication\UserDto.cs`:

```cs
namespace RetailStoreManagement.Models.Authentication;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Role { get; set; }
}

```

`Category\CategoryResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Category;

public class CategoryResponseDto
{
    public int Id { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
}

```

`Category\CreateCategoryRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Category;

public class CreateCategoryRequest
{
    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
}

```

`Category\UpdateCategoryRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Category;

public class UpdateCategoryRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;
}

```

`Common\BasePagedRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Base class cho tất cả các request có phân trang
/// Chỉ chứa các thuộc tính cơ bản: Page và PageSize
/// Sử dụng cho các endpoint không cần Search, SortBy, SortDesc (ví dụ: Report endpoints)
/// </summary>
public class BasePagedRequest
{
    private const int MaxPageSize = 100;
    
    /// <summary>
    /// Số trang hiện tại (bắt đầu từ 1)
    /// </summary>
    public int Page { get; set; } = 1;
    
    private int _pageSize = 10;

    /// <summary>
    /// Số lượng items trên mỗi trang (tối đa 100)
    /// </summary>
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}


```

`Common\CategorySearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Category
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class CategorySearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo số lượng sản phẩm tối thiểu trong category
    /// </summary>
    public int? MinProductCount { get; set; }

    /// <summary>
    /// Lọc theo số lượng sản phẩm tối đa trong category
    /// </summary>
    public int? MaxProductCount { get; set; }

    /// <summary>
    /// Lọc theo ngày tạo từ ngày này trở đi
    /// </summary>
    public DateTime? CreatedAfter { get; set; }

    /// <summary>
    /// Lọc theo ngày tạo đến ngày này
    /// </summary>
    public DateTime? CreatedBefore { get; set; }
}

```

`Common\CustomerSearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Customer
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class CustomerSearchRequest : PagedRequest
{
    // Có thể thêm các filters riêng cho Customer sau này
    // Ví dụ: MinTotalSpent, MaxTotalSpent, HasEmail, etc.
}


```

`Common\InventorySearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Inventory
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class InventorySearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo ProductId
    /// </summary>
    public int? ProductId { get; set; }

    /// <summary>
    /// Lọc theo số lượng tối thiểu
    /// </summary>
    public int? MinQuantity { get; set; }

    /// <summary>
    /// Lọc theo số lượng tối đa
    /// </summary>
    public int? MaxQuantity { get; set; }
}


```

`Common\OrderSearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

public class OrderSearchRequest : PagedRequest
{
    public string? Status { get; set; }
    public int? CustomerId { get; set; }
    public int? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

```

`Common\PagedRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho phân trang với đầy đủ tính năng
/// Kế thừa từ BasePagedRequest và thêm Search, SortBy, SortDesc
/// Sử dụng cho các endpoint cần search và sorting động
/// </summary>
public class PagedRequest : BasePagedRequest
{
    /// <summary>
    /// Từ khóa tìm kiếm (optional)
    /// </summary>
    public string? Search { get; set; }

    /// <summary>
    /// Tên property để sắp xếp (mặc định: "Id")
    /// </summary>
    public string SortBy { get; set; } = "Id";

    /// <summary>
    /// Sắp xếp giảm dần (true) hoặc tăng dần (false)
    /// </summary>
    public bool SortDesc { get; set; } = true;
}


```

`Common\ProductSearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

public class ProductSearchRequest : PagedRequest
{
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}

```

`Common\PromotionSearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Promotion
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class PromotionSearchRequest : PagedRequest
{
    // Có thể thêm các filters riêng cho Promotion sau này
    // Ví dụ: Status, DiscountType, MinDiscountValue, etc.
}


```

`Common\SupplierSearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Supplier
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class SupplierSearchRequest : PagedRequest
{
    // Có thể thêm các filters riêng cho Supplier sau này
    // Ví dụ: MinProductCount, MaxProductCount, HasEmail, etc.
}


```

`Common\UserSearchRequest.cs`:

```cs
namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang User
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class UserSearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo Role (0: Admin, 1: Staff)
    /// </summary>
    public int? Role { get; set; }
}


```

`Customer\CreateCustomerRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Customer;

public class CreateCustomerRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}

```

`Customer\CustomerListDto.cs`:

```cs
namespace RetailStoreManagement.Models.Customer;

public class CustomerListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateTime? LastOrderDate { get; set; }
}

```

`Customer\CustomerResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Customer;

public class CustomerResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime CreatedAt { get; set; }
}

```

`Customer\UpdateCustomerRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Customer;

public class UpdateCustomerRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}

```

`Inventory\InventoryHistoryDto.cs`:

```cs
namespace RetailStoreManagement.Models.Inventory;

public class InventoryHistoryDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int QuantityChange { get; set; }
    public int QuantityAfter { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
}

```

`Inventory\InventoryResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Inventory;

public class InventoryResponseDto
{
    public int InventoryId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Status { get; set; } = string.Empty; // 'in_stock' | 'low_stock' | 'out_of_stock'
}

```

`Inventory\LowStockAlertDto.cs`:

```cs
namespace RetailStoreManagement.Models.Inventory;

public class LowStockAlertDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int CurrentQuantity { get; set; }
    public int Threshold { get; set; }
}

```

`Inventory\UpdateInventoryRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Inventory;

public class UpdateInventoryRequest
{
    [Required]
    public int QuantityChange { get; set; } // Positive to increase, negative to decrease

    [Required]
    [MaxLength(255)]
    public string Reason { get; set; } = string.Empty;
}

```

`Order\AddOrderItemRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class AddOrderItemRequest
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}

```

`Order\CreateOrderRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class CreateOrderRequest
{
    [Required]
    public int CustomerId { get; set; }

    [MaxLength(50)]
    public string? PromoCode { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Order must have at least one item.")]
    public List<OrderItemInput> OrderItems { get; set; } = new();
}

```

`Order\OrderDetailsDto.cs`:

```cs
namespace RetailStoreManagement.Models.Order;

public class OrderDetailsDto : OrderResponseDto
{
    public List<OrderItemDto> OrderItems { get; set; } = new();
    public PaymentDto? PaymentInfo { get; set; }
}

```

`Order\OrderItemDto.cs`:

```cs
namespace RetailStoreManagement.Models.Order;

public class OrderItemDto
{
    public int OrderItemId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
}

```

`Order\OrderItemInput.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class OrderItemInput
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}

```

`Order\OrderItemResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Order;

public class OrderItemResponseDto
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Subtotal { get; set; }
}

```

`Order\OrderListDto.cs`:

```cs
namespace RetailStoreManagement.Models.Order;

public class OrderListDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string StaffName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal FinalAmount { get; set; }
}

```

`Order\OrderResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Order;

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

`Order\PaymentDto.cs`:

```cs
namespace RetailStoreManagement.Models.Order;

public class PaymentDto
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
}

```

`Order\UpdateOrderItemRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class UpdateOrderItemRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}

```

`Order\UpdateOrderStatusRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class UpdateOrderStatusRequest
{
    [Required]
    [RegularExpression("^(paid|canceled)$", ErrorMessage = "Status must be 'paid' or 'canceled'")]
    public string Status { get; set; } = string.Empty;
}

```

`Product\CreateProductRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Product;

public class CreateProductRequest
{
    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Barcode { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = "pcs";
}

```

`Product\ProductListDto.cs`:

```cs
namespace RetailStoreManagement.Models.Product;

public class ProductListDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
    public int InventoryQuantity { get; set; }
}

```

`Product\ProductResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Product;

public class ProductResponseDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int InventoryQuantity { get; set; }
    public DateTime CreatedAt { get; set; }
}

```

`Product\UpdateProductRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Product;

public class UpdateProductRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Barcode { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = "pcs";

}

```

`Promotion\CreatePromotionRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Promotion;

public class CreatePromotionRequest
{
    [Required]
    [MaxLength(50)]
    public string PromoCode { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be 'percent' or 'fixed'")]
    public string DiscountType { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
    public decimal DiscountValue { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal MinOrderAmount { get; set; } = 0;

    [Range(1, int.MaxValue, ErrorMessage = "Usage limit must be at least 1")]
    public int UsageLimit { get; set; } = 1;

    [Required]
    [RegularExpression("^(active|inactive)$", ErrorMessage = "Status must be 'active' or 'inactive'")]
    public string Status { get; set; } = "active";
}

```

`Promotion\PromotionListDto.cs`:

```cs
namespace RetailStoreManagement.Models.Promotion;

public class PromotionListDto
{
    public int Id { get; set; }
    public string PromoCode { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int UsedCount { get; set; }
    public int RemainingUsage { get; set; }
}

```

`Promotion\PromotionResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Promotion;

public class PromotionResponseDto
{
    public int Id { get; set; }
    public string PromoCode { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public int RemainingUsage { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

```

`Promotion\UpdatePromotionRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Promotion;

public class UpdatePromotionRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string PromoCode { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be 'percent' or 'fixed'")]
    public string DiscountType { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
    public decimal DiscountValue { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal MinOrderAmount { get; set; } = 0;

    [Range(1, int.MaxValue, ErrorMessage = "Usage limit must be at least 1")]
    public int UsageLimit { get; set; } = 1;

    [Required]
    [RegularExpression("^(active|inactive)$", ErrorMessage = "Status must be 'active' or 'inactive'")]
    public string Status { get; set; } = "active";
}

```

`Promotion\ValidatePromoRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Promotion;

public class ValidatePromoRequest
{
    [Required]
    public string PromoCode { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal OrderAmount { get; set; }
}

```

`Promotion\ValidatePromoResponse.cs`:

```cs
namespace RetailStoreManagement.Models.Promotion;

public class ValidatePromoResponse
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public int? PromoId { get; set; }
}

```

`Supplier\CreateSupplierRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Supplier;

public class CreateSupplierRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}

```

`Supplier\SupplierResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.Supplier;

public class SupplierResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Address { get; set; }
    public int ProductCount { get; set; }
}

```

`Supplier\UpdateSupplierRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Supplier;

public class UpdateSupplierRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}

```

`User\CreateUserRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.User;

public class CreateUserRequest
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(0, 1)]
    public int Role { get; set; } // 0: Admin, 1: Staff
}

```

`User\UpdateUserRequest.cs`:

```cs
using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.User;

public class UpdateUserRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Password { get; set; } // Nullable - empty string means no password change

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(0, 1)]
    public int Role { get; set; } // 0: Admin, 1: Staff

}

```

`User\UserResponseDto.cs`:

```cs
namespace RetailStoreManagement.Models.User;

public class UserResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int Role { get; set; } // 0: Admin, 1: Staff
    public DateTime CreatedAt { get; set; }
}

```