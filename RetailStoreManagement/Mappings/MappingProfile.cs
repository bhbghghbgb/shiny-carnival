using AutoMapper;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Enums;
using RetailStoreManagement.Models.DTOs.Authentication;
using RetailStoreManagement.Models.DTOs.Categories;
using RetailStoreManagement.Models.DTOs.Customers;
using RetailStoreManagement.Models.DTOs.Inventory;
using RetailStoreManagement.Models.DTOs.Orders;
using RetailStoreManagement.Models.DTOs.Products;
using RetailStoreManagement.Models.DTOs.Promotions;
using RetailStoreManagement.Models.DTOs.Suppliers;
using RetailStoreManagement.Models.DTOs.Users;

namespace RetailStoreManagement.Mappings;

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
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (UserRole)src.Role));

        CreateMap<UpdateUserRequest, UserEntity>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => (UserRole)src.Role))
            .ForMember(dest => dest.Password, opt => opt.Ignore());

        // Product mappings
        CreateMap<ProductEntity, ProductResponseDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
            .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name))
            .ForMember(dest => dest.InventoryQuantity, opt => opt.MapFrom(src => src.Inventory != null ? src.Inventory.Quantity : 0));

        CreateMap<ProductEntity, ProductListDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
            .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name))
            .ForMember(dest => dest.InventoryQuantity, opt => opt.MapFrom(src => src.Inventory != null ? src.Inventory.Quantity : 0));

        CreateMap<CreateProductRequest, ProductEntity>();
        CreateMap<UpdateProductRequest, ProductEntity>();

        // Category mappings
        CreateMap<CategoryEntity, CategoryResponseDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count(p => !p.IsDeleted)));

        CreateMap<CreateCategoryRequest, CategoryEntity>();
        CreateMap<UpdateCategoryRequest, CategoryEntity>();

        // Supplier mappings
        CreateMap<SupplierEntity, SupplierResponseDto>()
            .ForMember(dest => dest.ProductCount, opt => opt.MapFrom(src => src.Products.Count(p => !p.IsDeleted)));

        CreateMap<CreateSupplierRequest, SupplierEntity>();
        CreateMap<UpdateSupplierRequest, SupplierEntity>();

        // Customer mappings
        CreateMap<CustomerEntity, CustomerResponseDto>()
            .ForMember(dest => dest.TotalOrders, opt => opt.MapFrom(src => src.Orders.Count(o => !o.IsDeleted)))
            .ForMember(dest => dest.TotalSpent, opt => opt.MapFrom(src => 
                src.Orders.Where(o => o.Status == OrderStatus.Paid && !o.IsDeleted)
                    .Sum(o => o.TotalAmount - o.DiscountAmount)));

        CreateMap<CustomerEntity, CustomerListDto>()
            .ForMember(dest => dest.LastOrderDate, opt => opt.MapFrom(src => 
                src.Orders.Where(o => !o.IsDeleted).OrderByDescending(o => o.OrderDate).Select(o => (DateTime?)o.OrderDate).FirstOrDefault()));

        CreateMap<CreateCustomerRequest, CustomerEntity>();
        CreateMap<UpdateCustomerRequest, CustomerEntity>();

        // Order mappings
        CreateMap<OrderEntity, OrderResponseDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : ""))
            .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Phone : ""))
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.User.FullName ?? ""))
            .ForMember(dest => dest.PromoCode, opt => opt.MapFrom(src => src.Promotion != null ? src.Promotion.PromoCode : null))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.FinalAmount, opt => opt.MapFrom(src => src.TotalAmount - src.DiscountAmount));

        CreateMap<OrderEntity, OrderDetailsDto>()
            .IncludeBase<OrderEntity, OrderResponseDto>()
            .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
            .ForMember(dest => dest.PaymentInfo, opt => opt.MapFrom(src => 
                src.Payments.OrderByDescending(p => p.PaymentDate).FirstOrDefault()));

        CreateMap<OrderEntity, OrderListDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : ""))
            .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.User.FullName ?? ""))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.FinalAmount, opt => opt.MapFrom(src => src.TotalAmount - src.DiscountAmount));

        CreateMap<OrderItemEntity, OrderItemDto>()
            .ForMember(dest => dest.OrderItemId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Product.Barcode ?? ""));

        CreateMap<PaymentEntity, PaymentDto>()
            .ForMember(dest => dest.PaymentId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod.ToString()));

        // Promotion mappings
        CreateMap<PromotionEntity, PromotionResponseDto>()
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType.ToString().ToLower()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.RemainingUsage, opt => opt.MapFrom(src => src.UsageLimit > 0 ? Math.Max(0, src.UsageLimit - src.UsedCount) : int.MaxValue))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => 
                src.Status == PromotionStatus.Active && 
                DateOnly.FromDateTime(DateTime.UtcNow) >= src.StartDate && 
                DateOnly.FromDateTime(DateTime.UtcNow) <= src.EndDate))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate.ToDateTime(TimeOnly.MinValue)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate.ToDateTime(TimeOnly.MinValue)));

        CreateMap<PromotionEntity, PromotionListDto>()
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType.ToString().ToLower()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString().ToLower()))
            .ForMember(dest => dest.RemainingUsage, opt => opt.MapFrom(src => src.UsageLimit > 0 ? Math.Max(0, src.UsageLimit - src.UsedCount) : int.MaxValue))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate.ToDateTime(TimeOnly.MinValue)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate.ToDateTime(TimeOnly.MinValue)));

        CreateMap<CreatePromotionRequest, PromotionEntity>()
            .ForMember(dest => dest.DiscountType, opt => opt.MapFrom(src => src.DiscountType.ToLower() == "percent" ? DiscountType.Percent : DiscountType.Fixed))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToLower() == "active" ? PromotionStatus.Active : PromotionStatus.Inactive))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.StartDate)))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => DateOnly.FromDateTime(src.EndDate)));

        // Inventory mappings
        CreateMap<InventoryEntity, InventoryResponseDto>()
            .ForMember(dest => dest.InventoryId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Product.Barcode ?? ""))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => 
                src.Quantity == 0 ? "out_of_stock" : 
                src.Quantity < 10 ? "low_stock" : "in_stock"));

        CreateMap<InventoryHistoryEntity, InventoryHistoryDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.User.FullName ?? src.User.Username))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.CreatedAt));
    }
}
