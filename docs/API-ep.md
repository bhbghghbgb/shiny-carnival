Tạo một REST API backend server cho hệ thống quản lý cửa hàng với các yêu cầu sau:

**Công nghệ:**

- .NET Core Web API với Entity Framework Core
- Kết nối Neon PostgreSQL database
- JWT Authentication với role-based authorization (Admin, Staff)
- Soft delete pattern cho tất cả entities

**Cấu trúc Response chuẩn:**

- Tất cả endpoint trả về ApiResponse<T> với cấu trúc: { isError: boolean, message: string, data: T, timestamp: DateTime }
- Hỗ trợ phân trang với PagedList<T> cho GET collections: { page, pageSize, totalCount, totalPages, hasPrevious, hasNext, items }
- PagedRequest query params: page, pageSize, search, sortBy, sortDesc
- Error handling: HTTP 500 với ApiResponse có isError=true, message=exception.Message, data=null

**Database Schema (từ ERD):**
Users (user_id, username UK, password, full_name, role enum[admin=0,staff=1], created_at)
Customers (customer_id, name, phone, email, address, created_at)
Categories (category_id, category_name)
Suppliers (supplier_id, name, phone, email, address)
Products (product_id, category_id FK, supplier_id FK, product_name, barcode UK, price, unit, created_at)
Inventory (inventory_id, product_id FK, quantity, updated_at)
Promotions (promo_id, promo_code UK, description, discount_type enum[percent,fixed], discount_value, start_date, end_date, min_order_amount, usage_limit, used_count, status enum[active,inactive])
Orders (order_id, customer_id FK, user_id FK, promo_id FK nullable, order_date, status enum[pending,paid,canceled], total_amount, discount_amount)
Order_Items (order_item_id, order_id FK, product_id FK, quantity, price, subtotal)
Payments (payment_id, order_id FK, amount, payment_method enum[cash,card,bank_transfer,e-wallet], payment_date)

**DTOs cần thiết:**

1. **Authentication DTOs:**
   
   - LoginRequest: { username: string, password: string }
   - LoginResponse: { token: string, user: UserDto }
   - UserDto: { id: int, username: string, fullName: string, role: int }

2. **User Management DTOs:**
   
   - CreateUserRequest: { username: string, password: string, fullName: string, role: int }
   - UpdateUserRequest: { id: int, username: string, password?: string, fullName: string, role: int }
   - UserResponseDto: { id: int, username: string, fullName: string, role: int, createdAt: DateTime }

3. **Product DTOs:**
   
   - CreateProductRequest: { categoryId: int, supplierId: int, productName: string, barcode: string, price: decimal, unit: string }
   - UpdateProductRequest: { id: int, categoryId: int, supplierId: int, productName: string, barcode: string, price: decimal, unit: string }
   - ProductResponseDto: { id: int, categoryId: int, categoryName: string, supplierId: int, supplierName: string, productName: string, barcode: string, price: decimal, unit: string, inventoryQuantity: int, createdAt: DateTime }
   - ProductListDto: { id: int, productName: string, barcode: string, price: decimal, unit: string, categoryName: string, supplierName: string, inventoryQuantity: int }
   - ProductSearchRequest: extends PagedRequest + { categoryId?: int, supplierId?: int, minPrice?: decimal, maxPrice?: decimal }

4. **Category DTOs:**
   
   - CreateCategoryRequest: { categoryName: string }
   - UpdateCategoryRequest: { id: int, categoryName: string }
   - CategoryResponseDto: { id: int, categoryName: string, productCount: int }

5. **Supplier DTOs:**
   
   - CreateSupplierRequest: { name: string, phone: string, email: string, address: string }
   - UpdateSupplierRequest: { id: int, name: string, phone: string, email: string, address: string }
   - SupplierResponseDto: { id: int, name: string, phone: string, email: string, address: string, productCount: int }

6. **Customer DTOs:**
   
   - CreateCustomerRequest: { name: string, phone: string, email: string, address: string }
   - UpdateCustomerRequest: { id: int, name: string, phone: string, email: string, address: string }
   - CustomerResponseDto: { id: int, name: string, phone: string, email: string, address: string, totalOrders: int, totalSpent: decimal, createdAt: DateTime }
   - CustomerListDto: { id: int, name: string, phone: string, email: string, lastOrderDate?: DateTime }

7. **Order DTOs:**
   
   - CreateOrderRequest: { customerId: int, promoCode?: string, orderItems: OrderItemInput[] }
   - OrderItemInput: { productId: int, quantity: int }
   - UpdateOrderStatusRequest: { status: string } // 'paid' | 'canceled'
   - OrderResponseDto: { id: int, customerId: int, customerName: string, customerPhone: string, userId: int, staffName: string, promoId?: int, promoCode?: string, orderDate: DateTime, status: string, totalAmount: decimal, discountAmount: decimal, finalAmount: decimal }
   - OrderDetailsDto: extends OrderResponseDto + { orderItems: OrderItemDto[], paymentInfo?: PaymentDto }
   - OrderItemDto: { orderItemId: int, productId: int, productName: string, barcode: string, quantity: int, price: decimal, subtotal: decimal }
   - OrderListDto: { id: int, orderDate: DateTime, customerName: string, staffName: string, status: string, totalAmount: decimal, finalAmount: decimal }
   - OrderSearchRequest: extends PagedRequest + { status?: string, customerId?: int, userId?: int, startDate?: DateTime, endDate?: DateTime }
   - PaymentDto: { paymentId: int, amount: decimal, paymentMethod: string, paymentDate: DateTime }

8. **Order Item Management DTOs:**
   
   - AddOrderItemRequest: { productId: int, quantity: int }
   - UpdateOrderItemRequest: { quantity: int }
   - OrderItemResponseDto: { orderItemId: int, orderId: int, productId: int, productName: string, quantity: int, price: decimal, subtotal: decimal }

9. **Promotion DTOs:**
   
   - CreatePromotionRequest: { promoCode: string, description: string, discountType: string, discountValue: decimal, startDate: DateTime, endDate: DateTime, minOrderAmount: decimal, usageLimit: int, status: string }
   - UpdatePromotionRequest: { id: int, promoCode: string, description: string, discountType: string, discountValue: decimal, startDate: DateTime, endDate: DateTime, minOrderAmount: decimal, usageLimit: int, status: string }
   - PromotionResponseDto: { id: int, promoCode: string, description: string, discountType: string, discountValue: decimal, startDate: DateTime, endDate: DateTime, minOrderAmount: decimal, usageLimit: int, usedCount: int, remainingUsage: int, status: string, isActive: bool }
   - PromotionListDto: { id: int, promoCode: string, description: string, discountType: string, discountValue: decimal, startDate: DateTime, endDate: DateTime, status: string, usedCount: int, remainingUsage: int }
   - ValidatePromoRequest: { promoCode: string, orderAmount: decimal }
   - ValidatePromoResponse: { isValid: bool, message: string, discountAmount: decimal, promoId?: int }

10. **Inventory DTOs:**
    
    - InventoryResponseDto: { inventoryId: int, productId: int, productName: string, barcode: string, quantity: int, updatedAt: DateTime, status: string } // status: 'in_stock' | 'low_stock' | 'out_of_stock'
    - UpdateInventoryRequest: { quantityChange: int, reason: string }
    - InventoryHistoryDto: { id: int, productId: int, productName: string, quantityChange: int, quantityAfter: int, reason: string, updatedBy: string, updatedAt: DateTime }
    - LowStockAlertDto: { productId: int, productName: string, barcode: string, currentQuantity: int, threshold: int }

11. **Report DTOs:**
    
    - RevenueReportRequest: { startDate: DateTime, endDate: DateTime, groupBy: string } // 'day' | 'week' | 'month'
    - RevenueReportDto: { summary: RevenueSummaryDto, details: RevenueDetailDto[] }
    - RevenueSummaryDto: { overallRevenue: decimal, overallOrders: int, overallDiscount: decimal, averageOrderValue: decimal, period: string }
    - RevenueDetailDto: { period: string, totalRevenue: decimal, totalOrders: int, totalDiscount: decimal, averageOrderValue: decimal, date: DateTime }
    - TopProductDto: { productId: int, productName: string, totalQuantitySold: int, totalRevenue: decimal, orderCount: int }
    - TopCustomerDto: { customerId: int, customerName: string, totalOrders: int, totalSpent: decimal, lastOrderDate: DateTime }
    - SalesReportRequest: { startDate: DateTime, endDate: DateTime, groupBy?: string, categoryId?: int }
    - SalesReportDto: { topProducts: TopProductDto[], topCustomers: TopCustomerDto[], categoryBreakdown: CategorySalesDto[] }
    - CategorySalesDto: { categoryId: int, categoryName: string, totalRevenue: decimal, totalQuantitySold: int, productCount: int }

12. **Common DTOs:**
    
    - PagedRequest: { page: int = 1, pageSize: int = 20, search?: string, sortBy: string = "Id", sortDesc: bool = true }
    - PagedList<T>: { page: int, pageSize: int, totalCount: int, totalPages: int, hasPrevious: bool, hasNext: bool, items: T[] }
    - ApiResponse<T>: { isError: bool, message: string, data: T, timestamp: DateTime }
    - ErrorDetail: { field: string, message: string }
    - ValidationErrorResponse: extends ApiResponse + { errors: ErrorDetail[] }

**Endpoints cần implement:**

1. **Authentication (AllowAnonymous):**
   
   - POST /auth/login: LoginRequest → ApiResponse<LoginResponse>

2. **Users Management (Admin only):**
   
   - GET /admin/users: PagedRequest → ApiResponse<PagedList<UserResponseDto>>
   - GET /admin/users/{id} → ApiResponse<UserResponseDto>
   - POST /admin/users: CreateUserRequest → ApiResponse<UserResponseDto>
   - PUT /admin/users/{id}: UpdateUserRequest → ApiResponse<UserResponseDto>
   - DELETE /admin/users/{id} → ApiResponse<bool>

3. **Products (Admin only):**
   
   - GET /admin/products: ProductSearchRequest → ApiResponse<PagedList<ProductListDto>>
   - GET /admin/products/{id} → ApiResponse<ProductResponseDto>
   - POST /admin/products: CreateProductRequest → ApiResponse<ProductResponseDto>
   - PUT /admin/products/{id}: UpdateProductRequest → ApiResponse<ProductResponseDto>
   - DELETE /admin/products/{id} → ApiResponse<bool>

4. **Categories (Admin only):**
   
   - GET /admin/categories: PagedRequest → ApiResponse<PagedList<CategoryResponseDto>>
   - GET /admin/categories/{id} → ApiResponse<CategoryResponseDto>
   - POST /admin/categories: CreateCategoryRequest → ApiResponse<CategoryResponseDto>
   - PUT /admin/categories/{id}: UpdateCategoryRequest → ApiResponse<CategoryResponseDto>
   - DELETE /admin/categories/{id} → ApiResponse<bool>

5. **Suppliers (Admin only):**
   
   - GET /admin/suppliers: PagedRequest → ApiResponse<PagedList<SupplierResponseDto>>
   - GET /admin/suppliers/{id} → ApiResponse<SupplierResponseDto>
   - POST /admin/suppliers: CreateSupplierRequest → ApiResponse<SupplierResponseDto>
   - PUT /admin/suppliers/{id}: UpdateSupplierRequest → ApiResponse<SupplierResponseDto>
   - DELETE /admin/suppliers/{id} → ApiResponse<bool>

6. **Customers (Admin + Staff):**
   
   - GET /admin/customers: PagedRequest → ApiResponse<PagedList<CustomerListDto>>
   - GET /admin/customers/{id} → ApiResponse<CustomerResponseDto>
   - POST /admin/customers: CreateCustomerRequest → ApiResponse<CustomerResponseDto>
   - PUT /admin/customers/{id}: UpdateCustomerRequest → ApiResponse<CustomerResponseDto>
   - DELETE /admin/customers/{id} → ApiResponse<bool>

7. **Orders (Admin + Staff):**
   
   - GET /admin/orders: OrderSearchRequest → ApiResponse<PagedList<OrderListDto>>
   - GET /admin/orders/{id} → ApiResponse<OrderDetailsDto>
   - POST /admin/orders: CreateOrderRequest → ApiResponse<OrderDetailsDto>
   - PATCH /admin/orders/{id}/status: UpdateOrderStatusRequest → ApiResponse<OrderResponseDto>
   - GET /admin/orders/{id}/invoice → File (PDF)

8. **Order Items (Admin + Staff, chỉ khi order status=pending):**
   
   - POST /admin/orders/{orderId}/items: AddOrderItemRequest → ApiResponse<OrderItemResponseDto>
   - PUT /admin/orders/{orderId}/items/{itemId}: UpdateOrderItemRequest → ApiResponse<OrderItemResponseDto>
   - DELETE /admin/orders/{orderId}/items/{itemId} → ApiResponse<bool>

9. **Promotions (Admin only):**
   
   - GET /admin/promotions: PagedRequest + filter(status) → ApiResponse<PagedList<PromotionListDto>>
   - GET /admin/promotions/{id} → ApiResponse<PromotionResponseDto>
   - POST /admin/promotions: CreatePromotionRequest → ApiResponse<PromotionResponseDto>
   - PUT /admin/promotions/{id}: UpdatePromotionRequest → ApiResponse<PromotionResponseDto>
   - DELETE /admin/promotions/{id} → ApiResponse<bool>
   - POST /admin/promotions/validate: ValidatePromoRequest → ApiResponse<ValidatePromoResponse>

10. **Inventory (Admin + Staff):**
    
    - GET /admin/inventory: PagedRequest → ApiResponse<PagedList<InventoryResponseDto>>
    - GET /admin/inventory/{productId} → ApiResponse<InventoryResponseDto>
    - PATCH /admin/inventory/{productId}: UpdateInventoryRequest → ApiResponse<InventoryResponseDto>
    - GET /admin/inventory/low-stock → ApiResponse<List<LowStockAlertDto>>
    - GET /admin/inventory/{productId}/history: PagedRequest → ApiResponse<PagedList<InventoryHistoryDto>>

11. **Reports (Admin only):**
    
    - GET /admin/reports/revenue: RevenueReportRequest → ApiResponse<RevenueReportDto>
    - GET /admin/reports/sales: SalesReportRequest → ApiResponse<SalesReportDto>
    - GET /admin/reports/top-products?startDate&endDate&limit=10 → ApiResponse<List<TopProductDto>>
    - GET /admin/reports/top-customers?startDate&endDate&limit=10 → ApiResponse<List<TopCustomerDto>>

**Business Rules:**

- ## Business Logic chi tiết
  
  ### 1. Order Processing Flow
  
      // Service pseudo-code
      public async Task<OrderDetailDto> CreateOrderAsync(CreateOrderRequestDto request)
      {
          // 1. Validate customer exists
          // 2. Validate all products exist and have sufficient stock
          // 3. Apply promotion if promoCode provided:
          //    - Check status = active
          //    - Check current date in [startDate, endDate]
          //    - Check order total >= minOrderAmount
          //    - Check usedCount < usageLimit
          // 4. Calculate totals and discount
          // 5. Create order with status = 'pending'
          // 6. Create order items
          // 7. If promotion applied, increment usedCount
          // 8. Return OrderDetailDto
      }
      
      public async Task<OrderDetailDto> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequestDto request)
      {
          // 1. Validate order exists
          // 2. Validate status transition (pending → paid/canceled only)
          // 3. If status = 'paid':
          //    - Update inventory (decrease quantities)
          //    - Create payment record
          // 4. If status = 'canceled':
          //    - Rollback inventory if was previously 'paid'
          //    - Decrement promotion usedCount if was applied
          // 5. Return OrderDetailDto
      }
  
  ### 2. Promotion Validation
  
      public async Task<decimal> CalculateDiscountAsync(string promoCode, decimal orderTotal)
      {
          // 1. Find promotion by code
          // 2. Validate:
          //    - status == 'active'
          //    - DateTime.UtcNow >= startDate && DateTime.UtcNow <= endDate
          //    - orderTotal >= minOrderAmount
          //    - usedCount < usageLimit
          // 3. Calculate discount:
          //    - If discountType == 'percent': orderTotal * (discountValue / 100)
          //    - If discountType == 'fixed': discountValue
          // 4. Return discount amount
      }
  
  ### 3. Inventory Management
  
      public async Task CheckAndSendLowStockAlertsAsync()
      {
          // Background service:
          // 1. Query all inventory items where quantity < safetyStockLevel
          // 2. Get all admin emails
          // 3. Send email notification with list of low-stock products
          // 4. Log alert sent
      }
      
      public async Task UpdateInventoryAsync(int productId, UpdateInventoryRequestDto request)
      {
          // 1. Validate product exists
          // 2. Get current inventory
          // 3. Calculate new quantity (current + quantityChange)
          // 4. Validate new quantity >= 0
          // 5. Update inventory with new quantity and timestamp
          // 6. Log transaction (productId, oldQty, newQty, change, reason, userId, timestamp)
          // 7. If new quantity < safetyStockLevel, trigger alert
      }
  
  ### 4. Soft Delete Implementation
  
      // BaseEntity
      public abstract class BaseEntity
      {
          public int Id { get; set; }
          public DateTime CreatedAt { get; set; }
          public DateTime? UpdatedAt { get; set; }
          public bool IsDeleted { get; set; }
          public DateTime? DeletedAt { get; set; }
      }
      
      // DbContext configuration
      modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
      // ... for all entities
      
      // Repository soft delete
      public async Task<bool> SoftDeleteAsync(int id)
      {
          var entity = await _dbSet.FindAsync(id);
          if (entity == null) return false;
      
          entity.IsDeleted = true;
          entity.DeletedAt = DateTime.UtcNow;
          await _context.SaveChangesAsync();
          return true;
      }
  
  * * *
  
  ## Validation Strategy
  1. **Data Annotations** trên DTOs (basic validation)
  
  2. **FluentValidation** cho complex business rules
  
  3. **Service layer validation** cho cross-entity rules
      // Example FluentValidation
      public class CreateOrderRequestDtoValidator : AbstractValidator<CreateOrderRequestDto>
      {
     
          public CreateOrderRequestDtoValidator()
          {
              RuleFor(x => x.CustomerId).GreaterThan(0);
              RuleFor(x => x.OrderItems).NotEmpty();
              RuleForEach(x => x.OrderItems).SetValidator(new CreateOrderItemDtoValidator());
              RuleFor(x => x.PromoCode).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.PromoCode));
          }
     
      }
  
  * * *
  
  ## Mapping Strategy (AutoMapper)
  
      public class MappingProfile : Profile
      {
          public MappingProfile()
          {
              // User mappings
              CreateMap<User, UserResponseDto>();
              CreateMap<CreateUserRequestDto, User>();
              CreateMap<UpdateUserRequestDto, User>();
      
              // Product mappings
              CreateMap<Product, ProductResponseDto>()
                  .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.CategoryName))
                  .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name))
                  .ForMember(dest => dest.CurrentStock, opt => opt.MapFrom(src => src.Inventory.Quantity));
      
              CreateMap<CreateProductRequestDto, Product>();
              CreateMap<UpdateProductRequestDto, Product>();
      
              // Order mappings
              CreateMap<Order, OrderSummaryDto>()
                  .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.Name))
                  .ForMember(dest => dest.StaffName, opt => opt.MapFrom(src => src.User.FullName))
                  .ForMember(dest => dest.ItemCount, opt => opt.MapFrom(src => src.OrderItems.Count));
      
              CreateMap<Order, OrderDetailDto>()
                  .ForMember(dest => dest.FinalAmount, opt => opt.MapFrom(src => src.TotalAmount - src.DiscountAmount));
      
              CreateMap<OrderItem, OrderItemDto>()
                  .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
                  .ForMember(dest => dest.Barcode, opt => opt.MapFrom(src => src.Product.Barcode));
      
              // ... other mappings
          }
      }
  
  * * *
  
  Hãy sinh code hoàn chỉnh với:
  
  * ✅ DTOs validation đầy đủ
  * ✅ AutoMapper configurations
  * ✅ Error handling với proper HTTP status codes
  * ✅ Logging (Serilog)
  * ✅ JWT authentication & authorization
  * ✅ Soft delete với query filters
  * ✅ Business logic theo yêu cầu SRS
  * ✅ CORS configuration
  * ✅ Swagger/OpenAPI documentation
  * ✅ EF Core migrations cho Neon PostgreSQL
