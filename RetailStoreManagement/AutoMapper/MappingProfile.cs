using AutoMapper;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.Authentication;
using RetailStoreManagement.Models.User;
using RetailStoreManagement.Models.Product;
using RetailStoreManagement.Models.Category;
using RetailStoreManagement.Models.Supplier;
using RetailStoreManagement.Models.Customer;
using RetailStoreManagement.Models.Order;
using RetailStoreManagement.Models.Promotion;
using RetailStoreManagement.Models.Inventory;
using RetailStoreManagement.Models.Report;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<UserEntity, UserDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (int)src.Role));

        CreateMap<UserEntity, UserResponseDto>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (int)src.Role));

        CreateMap<CreateUserRequest, UserEntity>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (UserRole)src.Role))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore());

        CreateMap<UpdateUserRequest, UserEntity>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (UserRole)src.Role))
            .ForMember(dest => dest.Password, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Password)))
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore());

        // Product mappings
        CreateMap<ProductEntity, ProductResponseDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
            .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name))
            .ForMember(dest => dest.InventoryQuantity, opt => opt.MapFrom(src => src.Inventory != null ? src.Inventory.Quantity : 0));

        CreateMap<ProductEntity, ProductListDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
            .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name))
            .ForMember(dest => dest.InventoryQuantity, opt => opt.MapFrom(src => src.Inventory != null ? src.Inventory.Quantity : 0));

        CreateMap<CreateProductRequest, ProductEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.Supplier, opt => opt.Ignore())
            .ForMember(dest => dest.Inventory, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore());

        CreateMap<UpdateProductRequest, ProductEntity>()
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.Supplier, opt => opt.Ignore())
            .ForMember(dest => dest.Inventory, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore());

        // Category mappings
        CreateMap<CategoryEntity, CategoryResponseDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count));

        CreateMap<CreateCategoryRequest, CategoryEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());

        CreateMap<UpdateCategoryRequest, CategoryEntity>()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());

        // Supplier mappings
        CreateMap<SupplierEntity, SupplierResponseDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count));

        CreateMap<CreateSupplierRequest, SupplierEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());

        CreateMap<UpdateSupplierRequest, SupplierEntity>()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());

        // Customer mappings
        CreateMap<CustomerEntity, CustomerResponseDto>()
            .ForMember(dest => dest.TotalOrders, opt => opt.MapFrom(src => src.Orders.Count))
            .ForMember(dest => dest.TotalSpent, opt => opt.MapFrom(src => src.Orders.Where(o => o.Status == OrderStatus.Paid).Sum(o => o.TotalAmount - o.DiscountAmount)));

        CreateMap<CustomerEntity, CustomerListDto>()
            .ForMember(dest => dest.LastOrderDate, opt => opt.MapFrom(src => src.Orders.OrderByDescending(o => o.OrderDate).FirstOrDefault() != null ? src.Orders.OrderByDescending(o => o.OrderDate).First().OrderDate : (DateTime?)null));

        CreateMap<CreateCustomerRequest, CustomerEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());

        CreateMap<UpdateCustomerRequest, CustomerEntity>()
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());

        // Order mappings
        CreateMap<OrderEntity, OrderResponseDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : ""))
            .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Phone : ""))
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.PromoCode, opt => opt.MapFrom(src => src.Promotion != null ? src.Promotion.PromoCode : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.FinalAmount, opt => opt.MapFrom(src => src.TotalAmount - src.DiscountAmount));

        CreateMap<OrderEntity, OrderListDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : ""))
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.FinalAmount, opt => opt.MapFrom(src => src.TotalAmount - src.DiscountAmount));

        CreateMap<OrderEntity, OrderDetailsDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : ""))
            .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Phone : ""))
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.PromoCode, opt => opt.MapFrom(src => src.Promotion != null ? src.Promotion.PromoCode : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.FinalAmount, opt => opt.MapFrom(src => src.TotalAmount - src.DiscountAmount))
            .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
            .ForMember(dest => dest.PaymentInfo, opt => opt.MapFrom(src => src.Payments.FirstOrDefault()));

        CreateMap<CreateOrderRequest, OrderEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.PromoId, opt => opt.Ignore())
            .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => OrderStatus.Pending))
            .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
            .ForMember(dest => dest.DiscountAmount, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Customer, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Promotion, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore())
            .ForMember(dest => dest.Payments, opt => opt.Ignore());

        // OrderItem mappings
        CreateMap<OrderItemEntity, OrderItemDto>()
            .ForMember(dest => dest.OrderItemId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Product.Barcode));

        CreateMap<OrderItemEntity, OrderItemResponseDto>()
            .ForMember(dest => dest.OrderItemId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName));

        CreateMap<AddOrderItemRequest, OrderItemEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Price, opt => opt.Ignore())
            .ForMember(dest => dest.Subtotal, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore());

        // Payment mappings
        CreateMap<PaymentEntity, PaymentDto>()
            .ForMember(dest => dest.PaymentId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod.ToString().ToLower()));

        // Promotion mappings
        CreateMap<PromotionEntity, PromotionResponseDto>()
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType.ToString().ToLower()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.RemainingUsage, opt => opt.MapFrom(src => src.UsageLimit - src.UsedCount))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.Status == PromotionStatus.Active &&
                DateTime.UtcNow >= src.StartDate.ToDateTime(TimeOnly.MinValue) &&
                DateTime.UtcNow <= src.EndDate.ToDateTime(TimeOnly.MaxValue)));

        CreateMap<PromotionEntity, PromotionListDto>()
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType.ToString().ToLower()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.RemainingUsage, opt => opt.MapFrom(src => src.UsageLimit - src.UsedCount));

        CreateMap<CreatePromotionRequest, PromotionEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType == "percent" ? DiscountType.Percent : DiscountType.Fixed))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status == "active" ? PromotionStatus.Active : PromotionStatus.Inactive))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.StartDate)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.EndDate)))
            .ForMember(dest => dest.UsedCount, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());

        CreateMap<UpdatePromotionRequest, PromotionEntity>()
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType == "percent" ? DiscountType.Percent : DiscountType.Fixed))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status == "active" ? PromotionStatus.Active : PromotionStatus.Inactive))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.StartDate)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.EndDate)))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());

        // Inventory mappings
        CreateMap<InventoryEntity, InventoryResponseDto>()
            .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Product.Barcode))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                src.Quantity == 0 ? "out_of_stock" :
                src.Quantity < 10 ? "low_stock" : "in_stock"));

        CreateMap<InventoryHistoryEntity, InventoryHistoryDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.User.FullName))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.CreatedAt));
    }
}
