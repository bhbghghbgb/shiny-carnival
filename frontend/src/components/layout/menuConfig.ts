import type { AllowedRoles } from '../../app/routes/utils/routeGuards';

/**
 * Role requirements cho mỗi menu item
 * Key tương ứng với key trong Sidebar menu items
 */
export const menuItemRoles: Record<string, AllowedRoles[]> = {
  '1': ['both'], // Profile - cả Admin và Staff
  '2': ['staff'], // Order - chỉ Staff
  '5': ['admin'], // Users - chỉ Admin
  '5a': ['admin', 'staff'], // Products - Admin và Staff
  '6': ['admin', 'staff'], // Suppliers - Admin và Staff
  '7': ['admin'], // Categories - chỉ Admin
  '8': ['admin'], // Customers - chỉ Admin
  '9': ['admin'], // Orders - chỉ Admin
  '10': ['admin', 'staff'], // Inventory - Admin và Staff
  '11': ['admin'], // Promotions - chỉ Admin
  '12': ['admin'], // Reports - chỉ Admin
};

/**
 * Lấy danh sách roles được phép cho một menu item
 * 
 * @param menuKey - Key của menu item
 * @returns Danh sách roles được phép, mặc định là ['admin'] nếu không tìm thấy
 */
export function getMenuRoles(menuKey: string): AllowedRoles[] {
  return menuItemRoles[menuKey] || ['admin'];
}

/**
 * Kiểm tra user có quyền truy cập menu item không
 * 
 * @param menuKey - Key của menu item
 * @param isAdmin - User có phải admin không
 * @param isStaff - User có phải staff không
 * @returns true nếu user có quyền truy cập
 */
export function canAccessMenuItem(
  menuKey: string,
  isAdmin: boolean,
  isStaff: boolean
): boolean {
  const allowedRoles = getMenuRoles(menuKey);
  
  return allowedRoles.some((role) => {
    if (role === 'admin') {
      return isAdmin;
    }
    if (role === 'staff') {
      return isStaff;
    }
    if (role === 'both') {
      return isAdmin || isStaff;
    }
    return false;
  });
}

