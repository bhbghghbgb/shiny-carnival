// frontend/src/app/routes/modules/layout/admin.layout.tsx
import { createRoute, redirect, Outlet, type AnyRoute } from '@tanstack/react-router';
import { useAuthStore } from '../../../features/auth/store/authStore';

// Function để tạo adminLayoutRoute với parent được truyền vào
export function createAdminLayoutRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: 'admin',
    component: () => <Outlet />, // Render Outlet để hiển thị các route con
    beforeLoad: async () => {
      // Lấy state từ auth store
      const { isAuthenticated } = useAuthStore.getState();

      // Chỉ kiểm tra authentication ở layout level
      // Route guards ở từng route sẽ kiểm tra quyền cụ thể (admin/staff)
      if (!isAuthenticated) {
        // Redirect đến trang login
        throw redirect({
          to: '/auth/login' as any,
        });
      }

      // Không kiểm tra role ở đây - để route guards ở từng route kiểm tra
      // Điều này cho phép Staff truy cập các routes mà họ có quyền (Products, Inventory, Suppliers)
    }
  });
}
