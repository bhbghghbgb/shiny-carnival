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
      // TODO: TEMP DISABLE AUTH CHECK FOR TESTING
      // return;

      // Lấy state từ auth store
      const { isAuthenticated, isAdmin } = useAuthStore.getState();

      // Kiểm tra xem user đã đăng nhập chưa
      if (!isAuthenticated) {
        // Redirect đến trang login
        // Sử dụng window.location vì route có thể chưa được type-check trong route tree
        window.location.href = '/auth/login';
        return;
      }

      // Kiểm tra quyền admin
      if (!isAdmin()) {
        throw redirect({
          to: '/',
        });
      }
    }
  });
}
