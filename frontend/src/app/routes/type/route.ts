/**
 * Hằng số định nghĩa các đường dẫn trong ứng dụng
 * Được sử dụng để thay thế các giá trị basePath và path hardcode
 */

// Base paths cho các module
export const BASE_PATHS = {
  // Đường dẫn gốc
  HOME: '/',
  
  // Đường dẫn cho auth
  AUTH: '/auth',
  
  // Đường dẫn cho admin
  ADMIN: {
    ROOT: '/admin',
    CATEGORIES: '/admin/categories',
    INVENTORY: '/admin/inventory',
    PRODUCTS: '/admin/products',
    PROMOTIONS: '/admin/promotions',
    REPORTS: '/admin/reports',
    SUPPLIERS: '/admin/suppliers',
    USERS: '/admin/users',
  },
  
  // Đường dẫn cho các module khác
  CUSTOMERS: '/customers',
  ORDERS: '/orders',
  PRODUCTS: '/products',
} as const;

// Path cho các route cụ thể
export const ROUTE_PATHS = {
  // Auth routes
  AUTH_LOGIN: '/login',
 AUTH_REGISTER: '/register',
  AUTH_FORGOT_PASSWORD: '/forgot-password',
  AUTH_RESET_PASSWORD: '/reset-password',
  AUTH_PROFILE: '/profile',
  
 // Home route
 HOME: '/',
  
  // Customer routes
  CUSTOMERS: '/customers',
  CUSTOMERS_DETAIL: '/customers/$id',
  CUSTOMERS_CREATE: '/customers/create',
  CUSTOMERS_EDIT: '/customers/$id/edit',
  
 // Order routes
 ORDERS: '/orders',
  ORDERS_DETAIL: '/orders/$id',
  ORDERS_CREATE: '/orders/create',
  ORDERS_EDIT: '/orders/$id/edit',
  
 // Product routes
 PRODUCTS: '/products',
 PRODUCTS_DETAIL: '/products/$id',
  PRODUCTS_CREATE: '/products/create',
  PRODUCTS_EDIT: '/products/$id/edit',
  
 // Admin routes chung
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_INVENTORY: '/admin/inventory',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PROMOTIONS: '/admin/promotions',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_USERS: '/admin/users',
  
  // Admin CRUD routes
  ADMIN_CATEGORIES_DETAIL: '/admin/categories/$id',
  ADMIN_CATEGORIES_CREATE: '/admin/categories/create',
  ADMIN_CATEGORIES_EDIT: '/admin/categories/$id/edit',
  
 ADMIN_INVENTORY_DETAIL: '/admin/inventory/$id',
  ADMIN_INVENTORY_CREATE: '/admin/inventory/create',
  ADMIN_INVENTORY_EDIT: '/admin/inventory/$id/edit',
  
  ADMIN_PRODUCTS_DETAIL: '/admin/products/$id',
  ADMIN_PRODUCTS_CREATE: '/admin/products/create',
  ADMIN_PRODUCTS_EDIT: '/admin/products/$id/edit',
  
  ADMIN_PROMOTIONS_DETAIL: '/admin/promotions/$id',
  ADMIN_PROMOTIONS_CREATE: '/admin/promotions/create',
  ADMIN_PROMOTIONS_EDIT: '/admin/promotions/$id/edit',
  
 ADMIN_REPORTS_DETAIL: '/admin/reports/$id',
  ADMIN_REPORTS_CREATE: '/admin/reports/create',
  ADMIN_REPORTS_EDIT: '/admin/reports/$id/edit',
  
  ADMIN_SUPPLIERS_DETAIL: '/admin/suppliers/$id',
  ADMIN_SUPPLIERS_CREATE: '/admin/suppliers/create',
  ADMIN_SUPPLIERS_EDIT: '/admin/suppliers/$id/edit',
  
  ADMIN_USERS_DETAIL: '/admin/users/$id',
  ADMIN_USERS_CREATE: '/admin/users/create',
  ADMIN_USERS_EDIT: '/admin/users/$id/edit',
} as const;

// Hỗ trợ kết hợp basePath và path
export const COMBINED_PATHS = {
  // Auth routes (kết hợp basePath + path)
  AUTH_LOGIN: BASE_PATHS.AUTH + ROUTE_PATHS.AUTH_LOGIN,
 AUTH_REGISTER: BASE_PATHS.AUTH + ROUTE_PATHS.AUTH_REGISTER,
  AUTH_FORGOT_PASSWORD: BASE_PATHS.AUTH + ROUTE_PATHS.AUTH_FORGOT_PASSWORD,
  AUTH_RESET_PASSWORD: BASE_PATHS.AUTH + ROUTE_PATHS.AUTH_RESET_PASSWORD,
  AUTH_PROFILE: BASE_PATHS.AUTH + ROUTE_PATHS.AUTH_PROFILE,
  
  // Admin routes (kết hợp basePath + path)
  ADMIN_CATEGORIES: BASE_PATHS.ADMIN.CATEGORIES,
  ADMIN_CATEGORIES_DETAIL: BASE_PATHS.ADMIN.CATEGORIES + '/$id',
  ADMIN_CATEGORIES_CREATE: BASE_PATHS.ADMIN.CATEGORIES + '/create',
  ADMIN_CATEGORIES_EDIT: BASE_PATHS.ADMIN.CATEGORIES + '/$id/edit',
  
  ADMIN_INVENTORY: BASE_PATHS.ADMIN.INVENTORY,
  ADMIN_INVENTORY_DETAIL: BASE_PATHS.ADMIN.INVENTORY + '/$id',
  ADMIN_INVENTORY_CREATE: BASE_PATHS.ADMIN.INVENTORY + '/create',
  ADMIN_INVENTORY_EDIT: BASE_PATHS.ADMIN.INVENTORY + '/$id/edit',
  
  ADMIN_PRODUCTS: BASE_PATHS.ADMIN.PRODUCTS,
  ADMIN_PRODUCTS_DETAIL: BASE_PATHS.ADMIN.PRODUCTS + '/$id',
  ADMIN_PRODUCTS_CREATE: BASE_PATHS.ADMIN.PRODUCTS + '/create',
  ADMIN_PRODUCTS_EDIT: BASE_PATHS.ADMIN.PRODUCTS + '/$id/edit',
  
  ADMIN_PROMOTIONS: BASE_PATHS.ADMIN.PROMOTIONS,
  ADMIN_PROMOTIONS_DETAIL: BASE_PATHS.ADMIN.PROMOTIONS + '/$id',
  ADMIN_PROMOTIONS_CREATE: BASE_PATHS.ADMIN.PROMOTIONS + '/create',
  ADMIN_PROMOTIONS_EDIT: BASE_PATHS.ADMIN.PROMOTIONS + '/$id/edit',
  
  ADMIN_REPORTS: BASE_PATHS.ADMIN.REPORTS,
  ADMIN_REPORTS_DETAIL: BASE_PATHS.ADMIN.REPORTS + '/$id',
  ADMIN_REPORTS_CREATE: BASE_PATHS.ADMIN.REPORTS + '/create',
  ADMIN_REPORTS_EDIT: BASE_PATHS.ADMIN.REPORTS + '/$id/edit',
  
  ADMIN_SUPPLIERS: BASE_PATHS.ADMIN.SUPPLIERS,
  ADMIN_SUPPLIERS_DETAIL: BASE_PATHS.ADMIN.SUPPLIERS + '/$id',
  ADMIN_SUPPLIERS_CREATE: BASE_PATHS.ADMIN.SUPPLIERS + '/create',
  ADMIN_SUPPLIERS_EDIT: BASE_PATHS.ADMIN.SUPPLIERS + '/$id/edit',
  
  ADMIN_USERS: BASE_PATHS.ADMIN.USERS,
  ADMIN_USERS_DETAIL: BASE_PATHS.ADMIN.USERS + '/$id',
  ADMIN_USERS_CREATE: BASE_PATHS.ADMIN.USERS + '/create',
  ADMIN_USERS_EDIT: BASE_PATHS.ADMIN.USERS + '/$id/edit',
} as const;