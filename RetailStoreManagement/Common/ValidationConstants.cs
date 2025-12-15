namespace RetailStoreManagement.Common;

/// <summary>
/// Constants for validation constraints used across models
/// </summary>
public static class ValidationConstants
{
    // String length constraints
    public const int MAX_LENGTH_NAME = 100;           // ProductName, CategoryName, Name (Customer/Supplier), FullName
    public const int MAX_LENGTH_CODE = 50;            // Barcode, PromoCode, Username
    public const int MAX_LENGTH_PHONE = 20;           // Phone number
    public const int MAX_LENGTH_UNIT = 20;            // Unit (pcs, kg, etc.)
    public const int MAX_LENGTH_EMAIL = 100;          // Email address
    public const int MAX_LENGTH_ADDRESS = 255;        // Address
    public const int MAX_LENGTH_DESCRIPTION = 255;    // Description

    // Minimum length constraints
    public const int MIN_LENGTH_PASSWORD = 6;         // Password minimum length

    // Numeric constraints
    public const decimal MIN_PRICE = 0.01m;          // Minimum price/discount value
    public const int MIN_QUANTITY = 1;                // Minimum quantity for order items
    public const int MIN_USAGE_LIMIT = 1;             // Minimum usage limit for promotions

    // Role constraints
    public const int ROLE_ADMIN = 0;
    public const int ROLE_STAFF = 1;
}

