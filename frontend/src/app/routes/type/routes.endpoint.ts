/**
 * Hằng số định nghĩa các đường dẫn tuyệt đối trong ứng dụng.
 * Đây là nguồn đáng tin cậy duy nhất (single source of truth) cho tất cả các endpoint,
 * đảm bảo tính nhất quán và dễ dàng bảo trì sau khi tái cấu trúc route.
 */
export const ENDPOINTS = {
    HOME: '/',

    AUTH: {
        ROOT: '/auth',
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        PROFILE: '/auth/profile',
    },

    ADMIN: {
        ROOT: '/admin',
        USERS: '/admin/users',
        CATEGORIES: '/admin/categories',
        PRODUCTS: '/admin/products',
        PROMOTIONS: '/admin/promotions',
        REPORTS: '/admin/reports',
        SUPPLIERS: '/admin/suppliers',
        QR_SCANNER: '/admin/qr-scanner',

        CUSTOMERS: {
            LIST: '/admin/customers',
            DETAIL: '/admin/customers/$id',
            CREATE: '/admin/customers/create',
            EDIT: '/admin/customers/$id/edit',
        },

        ORDERS: {
            LIST: '/admin/orders',
            DETAIL: '/admin/orders/$id',
            CREATE: '/admin/orders/create',
            EDIT: '/admin/orders/$id/edit',
            TRACKING: '/admin/orders/$id/tracking',
        },

        INVENTORY: {
            LIST: '/admin/inventory',
            DETAIL: '/admin/inventory/$id',
            CREATE: '/admin/inventory/create',
            EDIT: '/admin/inventory/$id/edit',
        },
    },
} as const
