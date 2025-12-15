// Cấu hình API cho hệ thống quản lý cửa hàng

export const API_CONFIG = {
  // Base URL cho API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5175',
  
  // Timeout cho requests (milliseconds)
  TIMEOUT: 10000,
  
  // Các endpoints chính
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/Auth/login',
      REFRESH: '/api/Auth/refresh',
      LOGOUT: '/api/Auth/logout',
      SETUP_ADMIN: '/api/Auth/setup-admin',
    },
    
    // Admin endpoints
    ADMIN: {
      // Users
      USERS: '/api/admin/users',
      USER_BY_ID: (id: number) => `/api/admin/users/${id}`,
      
      // Products
      PRODUCTS: '/api/admin/products',
      PRODUCT_BY_ID: (id: number) => `/api/admin/products/${id}`,
      
      // Categories
      CATEGORIES: '/api/admin/categories',
      CATEGORY_BY_ID: (id: number) => `/api/admin/categories/${id}`,
      
      // Suppliers
      SUPPLIERS: '/api/admin/suppliers',
      SUPPLIER_BY_ID: (id: number) => `/api/admin/suppliers/${id}`,
      
      // Customers
      CUSTOMERS: '/api/admin/customers',
      CUSTOMER_BY_ID: (id: number) => `/api/admin/customers/${id}`,
      
      // Orders
      ORDERS: '/api/admin/orders',
      ORDER_BY_ID: (id: number) => `/api/admin/orders/${id}`,
      ORDER_STATUS: (id: number) => `/api/admin/orders/${id}/status`,
      ORDER_INVOICE: (id: number) => `/api/admin/orders/${id}/invoice`,
      ORDER_TOTAL_REVENUE: '/api/admin/orders/total-revenue',
      
      // Order Items
      ORDER_ITEMS: (orderId: number) => `/api/admin/orders/${orderId}/items`,
      ORDER_ITEM_BY_ID: (orderId: number, itemId: number) => `/api/admin/orders/${orderId}/items/${itemId}`,
      
      // Promotions
      PROMOTIONS: '/api/admin/promotions',
      PROMOTION_BY_ID: (id: number) => `/api/admin/promotions/${id}`,
      PROMOTION_VALIDATE: '/api/admin/promotions/validate',
      PROMOTION_ACTIVE_COUNT: '/api/admin/promotions/active-count',
      
      // Inventory
      INVENTORY: '/api/admin/inventory',
      INVENTORY_BY_PRODUCT: (productId: number) => `/api/admin/inventory/${productId}`,
      INVENTORY_LOW_STOCK: '/api/admin/inventory/low-stock',
      INVENTORY_HISTORY: (productId: number) => `/api/admin/inventory/${productId}/history`,
      
      // Reports
      REVENUE_REPORT: '/api/admin/reports/revenue',
      SALES_REPORT: '/api/admin/reports/sales',
      TOP_PRODUCTS: '/api/admin/reports/top-products',
      TOP_CUSTOMERS: '/api/admin/reports/top-customers',
    }
  },
  
  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Cấu hình pagination mặc định
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // Cấu hình retry
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // milliseconds
  },
  
  // User roles
  USER_ROLES: {
    ADMIN: 0,
    STAFF: 1,
  } as const,
  
  // Order status
  ORDER_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELED: 'canceled',
  } as const,
  
  // Promotion status
  PROMOTION_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  } as const,
  
  // Discount types
  DISCOUNT_TYPES: {
    PERCENT: 'percent',
    FIXED: 'fixed',
  } as const,
  
  // Payment methods
  PAYMENT_METHODS: {
    CASH: 'cash',
    CARD: 'card',
    BANK_TRANSFER: 'bank_transfer',
    E_WALLET: 'e-wallet',
  } as const,
} as const;

// Type definitions cho các constants
export type UserRole = typeof API_CONFIG.USER_ROLES[keyof typeof API_CONFIG.USER_ROLES];
export type OrderStatus = typeof API_CONFIG.ORDER_STATUS[keyof typeof API_CONFIG.ORDER_STATUS];
export type PromotionStatus = typeof API_CONFIG.PROMOTION_STATUS[keyof typeof API_CONFIG.PROMOTION_STATUS];
export type DiscountType = typeof API_CONFIG.DISCOUNT_TYPES[keyof typeof API_CONFIG.DISCOUNT_TYPES];
export type PaymentMethod = typeof API_CONFIG.PAYMENT_METHODS[keyof typeof API_CONFIG.PAYMENT_METHODS];


// Helper function để validate environment variables
export const validateEnvironment = (): void => {
  const requiredEnvVars = ['VITE_API_BASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Using default API configuration');
  }
};

// Gọi validation khi module được import
validateEnvironment();
