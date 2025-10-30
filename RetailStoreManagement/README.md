# Retail Store Management API

A comprehensive REST API backend for retail store management built with .NET 9.0, Entity Framework Core, and PostgreSQL (Neon).

## Features

- ✅ JWT Authentication with role-based authorization (Admin, Staff)
- ✅ Soft delete pattern for all entities
- ✅ Standardized API responses with `ApiResponse<T>`
- ✅ Pagination support with `PagedList<T>`
- ✅ Comprehensive business logic for order processing
- ✅ Promotion validation and discount calculation
- ✅ Inventory management with history tracking
- ✅ Sales and revenue reporting
- ✅ Swagger/OpenAPI documentation
- ✅ Serilog logging
- ✅ CORS configuration
- ✅ FluentValidation for request validation
- ✅ AutoMapper for entity-DTO mapping

## Technology Stack

- **.NET 9.0** - Web API Framework
- **Entity Framework Core 9.0** - ORM
- **PostgreSQL (Neon)** - Database
- **JWT Bearer** - Authentication
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **BCrypt.Net** - Password hashing
- **Serilog** - Logging
- **Swagger/OpenAPI** - API documentation

## Project Structure

```
RetailStoreManagement/
├── Common/                  # Shared models (ApiResponse, PagedList, PagedRequest)
├── Controllers/
│   ├── AuthController.cs
│   └── Admin/              # Admin-only controllers
│       ├── UsersController.cs
│       ├── ProductsController.cs
│       ├── CategoriesController.cs
│       ├── SuppliersController.cs
│       ├── CustomersController.cs
│       ├── OrdersController.cs
│       ├── PromotionsController.cs
│       ├── InventoryController.cs
│       └── ReportsController.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   └── UnitOfWork.cs
├── Entities/               # Database entities
├── Enums/                  # Enumerations
├── Filters/                # API filters
├── Interfaces/             # Service interfaces
├── Mappings/
│   └── MappingProfile.cs   # AutoMapper configuration
├── Models/
│   └── DTOs/               # Data Transfer Objects
│       ├── Authentication/
│       ├── Users/
│       ├── Products/
│       ├── Categories/
│       ├── Suppliers/
│       ├── Customers/
│       ├── Orders/
│       ├── OrderItems/
│       ├── Promotions/
│       ├── Inventory/
│       └── Reports/
├── Repositories/           # Generic repository pattern
├── Services/               # Business logic layer
│   ├── AuthService.cs
│   ├── UserService.cs
│   ├── ProductService.cs
│   ├── OrderService.cs
│   ├── PromotionService.cs
│   ├── InventoryService.cs
│   └── ReportService.cs
├── Validators/             # FluentValidation validators
├── Program.cs              # Application entry point
└── appsettings.json        # Configuration
```

## Setup Instructions

### Prerequisites

- .NET 9.0 SDK
- PostgreSQL database (Neon recommended)
- Visual Studio 2022 / VS Code / Rider

### 1. Clone and Restore

```bash
cd RetailStoreManagement
dotnet restore
```

### 2. Configure Database Connection

Update `appsettings.json` with your Neon PostgreSQL connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-neon-host.neon.tech;Database=retail_store_db;Username=your-username;Password=your-password;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

### 3. Configure JWT Settings

Update JWT settings in `appsettings.json`:

```json
{
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-at-least-32-characters-long",
    "Issuer": "store-management",
    "Audience": "store-management",
    "ExpirationMinutes": 1440
  }
}
```

### 4. Create and Apply Migrations

```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

### 5. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000` (redirects to Swagger)

## Default Credentials

After running migrations, a default admin user is created:

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change this password in production!

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username and password

### Users Management (Admin Only)

- `GET /api/admin/users` - Get paginated users
- `GET /api/admin/users/{id}` - Get user by ID
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Soft delete user

### Products (Admin Only)

- `GET /api/admin/products` - Get paginated products with filters
- `GET /api/admin/products/{id}` - Get product by ID
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Soft delete product

### Categories (Admin Only)

- `GET /api/admin/categories` - Get paginated categories
- `GET /api/admin/categories/{id}` - Get category by ID
- `POST /api/admin/categories` - Create new category
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Soft delete category

### Suppliers (Admin Only)

- `GET /api/admin/suppliers` - Get paginated suppliers
- `GET /api/admin/suppliers/{id}` - Get supplier by ID
- `POST /api/admin/suppliers` - Create new supplier
- `PUT /api/admin/suppliers/{id}` - Update supplier
- `DELETE /api/admin/suppliers/{id}` - Soft delete supplier

### Customers (Admin + Staff)

- `GET /api/admin/customers` - Get paginated customers
- `GET /api/admin/customers/{id}` - Get customer by ID
- `POST /api/admin/customers` - Create new customer
- `PUT /api/admin/customers/{id}` - Update customer
- `DELETE /api/admin/customers/{id}` - Soft delete customer

### Orders (Admin + Staff)

- `GET /api/admin/orders` - Get paginated orders with filters
- `GET /api/admin/orders/{id}` - Get order details
- `POST /api/admin/orders` - Create new order
- `PATCH /api/admin/orders/{id}/status` - Update order status (paid/canceled)
- `GET /api/admin/orders/{id}/invoice` - Download invoice PDF

### Promotions (Admin Only)

- `GET /api/admin/promotions` - Get paginated promotions
- `GET /api/admin/promotions/{id}` - Get promotion by ID
- `POST /api/admin/promotions` - Create new promotion
- `PUT /api/admin/promotions/{id}` - Update promotion
- `DELETE /api/admin/promotions/{id}` - Soft delete promotion
- `POST /api/admin/promotions/validate` - Validate promo code

### Inventory (Admin + Staff)

- `GET /api/admin/inventory` - Get paginated inventory
- `GET /api/admin/inventory/{productId}` - Get inventory by product
- `PATCH /api/admin/inventory/{productId}` - Update inventory quantity
- `GET /api/admin/inventory/low-stock` - Get low stock alerts
- `GET /api/admin/inventory/{productId}/history` - Get inventory history

### Reports (Admin Only)

- `GET /api/admin/reports/revenue` - Get revenue report
- `GET /api/admin/reports/sales` - Get sales report
- `GET /api/admin/reports/top-products` - Get top selling products
- `GET /api/admin/reports/top-customers` - Get top customers

## Business Logic

### Order Processing Flow

1. **Create Order**:
   - Validate customer exists
   - Validate all products exist and have sufficient stock
   - Apply promotion if promo code provided (validate status, date range, usage limit, min amount)
   - Calculate totals and discount
   - Create order with status = 'pending'
   - Create order items
   - Increment promotion used count

2. **Update Order Status**:
   - **To 'paid'**:
     - Decrease inventory quantities
     - Create inventory history records
     - Create payment record
   - **To 'canceled'**:
     - Decrement promotion used count if applied

### Promotion Validation

- Status must be 'active'
- Current date must be within [startDate, endDate]
- Order total must be >= minOrderAmount
- usedCount must be < usageLimit
- Calculate discount:
  - **Percent**: orderTotal * (discountValue / 100)
  - **Fixed**: min(discountValue, orderTotal)

### Inventory Management

- Automatic updates on order status changes
- History tracking for all quantity changes
- Low stock alerts (configurable threshold, default: 10)

### Soft Delete

- All entities support soft delete via `DeletedAt` property
- Global query filter automatically excludes deleted records
- Cascade considerations for related entities

## Authentication & Authorization

### JWT Token

After successful login, you'll receive a JWT token. Include it in subsequent requests:

```
Authorization: Bearer <your-token>
```

### Roles

- **Admin (0)**: Full access to all endpoints
- **Staff (1)**: Access to customers, orders, and inventory

### Policies

- **AdminOnly**: Requires Admin role
- **AdminOrStaff**: Requires Admin or Staff role

## Response Format

All endpoints return a standardized response:

```json
{
  "isError": false,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

### Paginated Response

```json
{
  "isError": false,
  "message": null,
  "data": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5,
    "hasPrevious": false,
    "hasNext": true,
    "items": [ ... ]
  },
  "timestamp": "2025-10-30T12:00:00Z"
}
```

## Error Handling

- **400 Bad Request**: Validation errors or business logic violations
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unhandled exceptions

## Logging

Logs are written to:
- Console (all environments)
- File: `logs/retail-store-{Date}.txt` (rolling daily)

## Development

### Adding New Migrations

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Removing Last Migration

```bash
dotnet ef migrations remove
```

### Viewing Migration SQL

```bash
dotnet ef migrations script
```

## Testing with Swagger

1. Navigate to `http://localhost:5000`
2. Click "Authorize" button
3. Login via `/api/auth/login` endpoint
4. Copy the token from response
5. Enter `Bearer <token>` in the authorization dialog
6. Test other endpoints

## Production Deployment

1. Update `appsettings.Production.json` with production settings
2. Change default admin password
3. Use strong JWT secret key (at least 32 characters)
4. Enable HTTPS
5. Configure proper CORS policy
6. Set up database backups
7. Configure log retention policies
8. Use environment variables for sensitive data

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
