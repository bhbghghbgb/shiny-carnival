import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../../../features/auth/store/authStore';
import type { LoaderContext } from '../type/types';

/**
 * Roles được phép truy cập route
 */
export type AllowedRoles = 'admin' | 'staff' | 'both';

/**
 * Tạo route guard function để kiểm tra quyền truy cập dựa trên role
 * 
 * @param allowedRoles - Danh sách roles được phép truy cập route
 * @returns Function guard để sử dụng trong beforeLoad hook
 * 
 * @example
 * ```typescript
 * beforeLoad: createRoleGuard(['admin', 'staff'])
 * ```
 */
export function createRoleGuard(allowedRoles: AllowedRoles[]) {
  return (ctx: LoaderContext) => {
    const { isAuthenticated, isAdmin, isStaff } = useAuthStore.getState();

    // Kiểm tra authentication trước
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: typeof window !== 'undefined' ? window.location.href : '/',
        },
      });
    }

    // Kiểm tra quyền truy cập dựa trên role
    const hasAccess = allowedRoles.some((role) => {
      if (role === 'admin') {
        return isAdmin();
      }
      if (role === 'staff') {
        return isStaff();
      }
      if (role === 'both') {
        return isAdmin() || isStaff();
      }
      return false;
    });

    // Nếu không có quyền, redirect đến trang unauthorized
    if (!hasAccess) {
      throw redirect({
        to: '/auth/unauthorized',
        search: {
          redirect: typeof window !== 'undefined' ? window.location.href : '/',
        },
      });
    }

    // Return empty object để không thay đổi context
    return {};
  };
}

/**
 * Helper function để kiểm tra user có phải admin không
 */
export function requireAdmin(ctx: LoaderContext) {
  return createRoleGuard(['admin'])(ctx);
}

/**
 * Helper function để kiểm tra user có phải staff không
 */
export function requireStaff(ctx: LoaderContext) {
  return createRoleGuard(['staff'])(ctx);
}

/**
 * Helper function để kiểm tra user đã authenticated (bất kỳ role nào)
 */
export function requireAuth(ctx: LoaderContext) {
  return createRoleGuard(['both'])(ctx);
}

