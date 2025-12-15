using ProductApp.Models;
using System.Text.Json;

namespace ProductApp.Core.Services;

public interface IFakeDataService
{
    List<ProductListDto> GetSampleProducts();
    LoginResponse GetSampleLoginResponse();
    OrderResponseDto GetSampleOrderResponse();
}

public class FakeDataService : IFakeDataService
{
    public List<ProductListDto> GetSampleProducts()
    {
        return new List<ProductListDto>
        {
            new ProductListDto 
            { 
                Id = 1, 
                ProductName = "Gaming Laptop", 
                Price = 1299.99m, 
                CategoryName = "Electronics", 
                InventoryQuantity = 15,
                Barcode = "LAP001",
                Unit = "pcs",
                SupplierName = "TechCorp"
            },
            new ProductListDto 
            { 
                Id = 2, 
                ProductName = "Wireless Mouse", 
                Price = 29.99m, 
                CategoryName = "Electronics", 
                InventoryQuantity = 50,
                Barcode = "MOU001",
                Unit = "pcs",
                SupplierName = "TechCorp"
            },
            new ProductListDto 
            { 
                Id = 3, 
                ProductName = "Mechanical Keyboard", 
                Price = 89.99m, 
                CategoryName = "Electronics", 
                InventoryQuantity = 25,
                Barcode = "KEY001",
                Unit = "pcs",
                SupplierName = "TechCorp"
            },
            new ProductListDto 
            { 
                Id = 4, 
                ProductName = "Office Chair", 
                Price = 199.99m, 
                CategoryName = "Furniture", 
                InventoryQuantity = 10,
                Barcode = "CHA001",
                Unit = "pcs",
                SupplierName = "OfficeSupplies"
            },
            new ProductListDto 
            { 
                Id = 5, 
                ProductName = "Notebook Set", 
                Price = 12.99m, 
                CategoryName = "Stationery", 
                InventoryQuantity = 100,
                Barcode = "NOTE001",
                Unit = "set",
                SupplierName = "OfficeSupplies"
            },
            new ProductListDto 
            { 
                Id = 6, 
                ProductName = "Ballpoint Pens (10pk)", 
                Price = 8.99m, 
                CategoryName = "Stationery", 
                InventoryQuantity = 200,
                Barcode = "PEN001",
                Unit = "pack",
                SupplierName = "OfficeSupplies"
            },
            new ProductListDto 
            { 
                Id = 7, 
                ProductName = "Coffee Mug", 
                Price = 14.99m, 
                CategoryName = "Kitchen", 
                InventoryQuantity = 75,
                Barcode = "MUG001",
                Unit = "pcs",
                SupplierName = "HomeGoods"
            },
            new ProductListDto 
            { 
                Id = 8, 
                ProductName = "Desk Lamp", 
                Price = 34.99m, 
                CategoryName = "Home", 
                InventoryQuantity = 30,
                Barcode = "LMP001",
                Unit = "pcs",
                SupplierName = "HomeGoods"
            }
        };
    }

    public LoginResponse GetSampleLoginResponse()
    {
        return new LoginResponse
        {
            Token = "fake-jwt-token-for-testing",
            RefreshToken = "fake-refresh-token",
            User = new UserDto
            {
                Id = 1,
                Username = "testuser",
                FullName = "Test User",
                Role = 1 // Staff
            }
        };
    }

    public OrderResponseDto GetSampleOrderResponse()
    {
        return new OrderResponseDto
        {
            Id = 1001,
            CustomerId = 1,
            CustomerName = "John Doe",
            CustomerPhone = "555-0123",
            UserId = 1,
            StaffName = "Test User",
            OrderDate = DateTime.Now,
            Status = "completed",
            TotalAmount = 159.97m,
            DiscountAmount = 0,
            FinalAmount = 159.97m
        };
    }
}
