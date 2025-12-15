namespace RetailStoreManagement.Common;

/// <summary>
/// Constants related to reporting functionality
/// </summary>
public static class ReportConstants
{
    /// <summary>
    /// Default page size for top products/customers in reports
    /// </summary>
    public const int DEFAULT_TOP_ITEMS_PAGE_SIZE = 10;

    /// <summary>
    /// Default page number for top items
    /// </summary>
    public const int DEFAULT_TOP_ITEMS_PAGE = 1;

    /// <summary>
    /// Maximum lookback months for inventory forecast
    /// </summary>
    public const int MAX_LOOKBACK_MONTHS = 12;

    /// <summary>
    /// Minimum lookback months for inventory forecast
    /// </summary>
    public const int MIN_LOOKBACK_MONTHS = 1;

    /// <summary>
    /// Maximum lead time days for inventory forecast
    /// </summary>
    public const int MAX_LEAD_TIME_DAYS = 90;

    /// <summary>
    /// Minimum lead time days for inventory forecast
    /// </summary>
    public const int MIN_LEAD_TIME_DAYS = 1;

    /// <summary>
    /// Maximum safety stock multiplier for inventory forecast
    /// </summary>
    public const double MAX_SAFETY_STOCK_MULTIPLIER = 3.0;

    /// <summary>
    /// Minimum safety stock multiplier for inventory forecast
    /// </summary>
    public const double MIN_SAFETY_STOCK_MULTIPLIER = 1.0;
}

