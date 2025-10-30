# Database Migration Guide

This guide explains how to set up and manage the database for the Retail Store Management API.

## Prerequisites

- .NET 9.0 SDK installed
- EF Core CLI tools installed
- Neon PostgreSQL database account

## Installing EF Core Tools

If you haven't installed EF Core tools globally:

```bash
dotnet tool install --global dotnet-ef
```

Or update existing installation:

```bash
dotnet tool update --global dotnet-ef
```

## Setting Up Neon PostgreSQL

### 1. Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Get Connection String

1. In your Neon dashboard, go to your project
2. Click on "Connection Details"
3. Copy the connection string
4. It should look like:
   ```
   Host=your-project.neon.tech;Database=neondb;Username=your-username;Password=your-password;SSL Mode=Require
   ```

### 3. Update appsettings.json

Replace the connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-project.neon.tech;Database=retail_store_db;Username=your-username;Password=your-password;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

## Creating Initial Migration

### 1. Navigate to Project Directory

```bash
cd RetailStoreManagement
```

### 2. Create Migration

```bash
dotnet ef migrations add InitialCreate
```

This will create a `Migrations` folder with the migration files.

### 3. Review Migration

Check the generated migration file in `Migrations/` folder to ensure it includes:

- All entity tables (Users, Customers, Categories, Suppliers, Products, Inventory, InventoryHistory, Promotions, Orders, OrderItems, Payments)
- Unique constraints (Username, Barcode, PromoCode)
- Indexes for performance
- Foreign key relationships
- Seed data (default admin user and categories)

### 4. Apply Migration

```bash
dotnet ef database update
```

This will:
- Create all tables in your Neon database
- Apply unique constraints and indexes
- Insert seed data

## Verifying Migration

### 1. Check Database

Connect to your Neon database using a PostgreSQL client (pgAdmin, DBeaver, or psql) and verify:

```sql
-- List all tables
\dt

-- Check Users table
SELECT * FROM "Users";

-- Check Categories table
SELECT * FROM "Categories";
```

You should see:
- 1 admin user (username: admin)
- 5 default categories

### 2. Test API

Run the application:

```bash
dotnet run
```

Test login with default credentials:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Common Migration Commands

### Create New Migration

```bash
dotnet ef migrations add MigrationName
```

### Apply Migrations

```bash
dotnet ef database update
```

### Rollback to Specific Migration

```bash
dotnet ef database update PreviousMigrationName
```

### Remove Last Migration (if not applied)

```bash
dotnet ef migrations remove
```

### Generate SQL Script

```bash
dotnet ef migrations script
```

### Generate SQL for Specific Migration

```bash
dotnet ef migrations script FromMigration ToMigration
```

## Database Schema

### Tables

1. **Users** - System users (Admin, Staff)
2. **Customers** - Store customers
3. **Categories** - Product categories
4. **Suppliers** - Product suppliers
5. **Products** - Store products
6. **Inventory** - Product inventory levels
7. **InventoryHistory** - Inventory change history
8. **Promotions** - Discount promotions
9. **Orders** - Customer orders
10. **OrderItems** - Order line items
11. **Payments** - Order payments

### Relationships

```
Users 1---* Orders (user_id)
Users 1---* InventoryHistory (user_id)

Customers 1---* Orders (customer_id)

Categories 1---* Products (category_id)

Suppliers 1---* Products (supplier_id)

Products 1---1 Inventory (product_id)
Products 1---* OrderItems (product_id)
Products 1---* InventoryHistory (product_id)

Promotions 1---* Orders (promo_id, nullable)

Orders 1---* OrderItems (order_id)
Orders 1---* Payments (order_id)
```

### Unique Constraints

- `Users.Username`
- `Products.Barcode`
- `Promotions.PromoCode`

### Indexes

- `Orders.OrderDate`
- `Orders.Status`
- `Products.ProductName`
- `Customers.Phone`
- `Inventory.Quantity`

## Seed Data

### Default Admin User

```
Username: admin
Password: admin123 (hashed with BCrypt)
FullName: System Administrator
Role: Admin (0)
```

### Default Categories

1. Electronics
2. Clothing
3. Food & Beverages
4. Home & Garden
5. Books

## Troubleshooting

### Error: "No DbContext was found"

Make sure you're in the correct directory:

```bash
cd RetailStoreManagement
```

### Error: "Unable to connect to database"

1. Check your connection string in `appsettings.json`
2. Verify your Neon database is running
3. Check firewall settings
4. Ensure SSL Mode is set correctly

### Error: "A connection was successfully established... but then an error occurred"

Add `Trust Server Certificate=true` to your connection string:

```
Host=...;SSL Mode=Require;Trust Server Certificate=true
```

### Error: "The entity type 'X' requires a primary key"

This shouldn't happen with the provided code, but if it does:
- Check that all entities inherit from `BaseEntity<int>`
- Verify the `Id` property is properly configured

### Migration Already Applied

If you need to recreate the database:

```bash
# Drop database (WARNING: This deletes all data!)
dotnet ef database drop

# Recreate database
dotnet ef database update
```

## Production Considerations

### 1. Backup Strategy

- Set up automated backups in Neon dashboard
- Test restore procedures regularly
- Keep migration scripts in version control

### 2. Migration Deployment

For production deployments:

```bash
# Generate SQL script
dotnet ef migrations script --idempotent --output migration.sql

# Review the script
# Apply manually or through CI/CD pipeline
```

### 3. Zero-Downtime Migrations

For breaking changes:
1. Add new columns/tables (backward compatible)
2. Deploy application code
3. Migrate data
4. Remove old columns/tables in next release

### 4. Connection Pooling

Neon automatically handles connection pooling. Configure in connection string if needed:

```
Host=...;Pooling=true;Minimum Pool Size=0;Maximum Pool Size=100
```

## Environment-Specific Configurations

### Development

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=dev-host.neon.tech;Database=retail_store_dev;..."
  }
}
```

### Staging

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=staging-host.neon.tech;Database=retail_store_staging;..."
  }
}
```

### Production

Use environment variables:

```bash
export ConnectionStrings__DefaultConnection="Host=prod-host.neon.tech;Database=retail_store_prod;..."
```

Or use Azure Key Vault, AWS Secrets Manager, etc.

## Monitoring

### Query Performance

Use Neon's built-in monitoring:
1. Go to Neon dashboard
2. Navigate to "Monitoring" tab
3. Review query performance metrics

### Slow Queries

Add logging in `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

## Support

For Neon-specific issues:
- [Neon Documentation](https://neon.tech/docs)
- [Neon Discord](https://discord.gg/neon)

For EF Core issues:
- [EF Core Documentation](https://docs.microsoft.com/ef/core/)
- [EF Core GitHub](https://github.com/dotnet/efcore)
