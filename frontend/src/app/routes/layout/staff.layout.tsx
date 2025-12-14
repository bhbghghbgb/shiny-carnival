// frontend/src/app/routes/modules/layout/staff.layout.tsx
import { createRoute, redirect, Outlet, type AnyRoute } from '@tanstack/react-router';
import { useAuthStore } from '../../../features/auth/store/authStore';

// Function để tạo staffLayoutRoute với parent được truyền vào
export function createStaffLayoutRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: 'staff',
    component: () => <Outlet />, // Render Outlet để hiển thị các route con
    beforeLoad: async () => {
      // Lấy state từ auth store
      const { isAuthenticated, isStaff } = useAuthStore.getState();

      // Kiểm tra xem user đã đăng nhập chưa
      if (!isAuthenticated) {
        // Redirect đến trang login
        // Sử dụng window.location vì route có thể chưa được type-check trong route tree
        window.location.href = '/auth/login';
        return;
      }

      // Kiểm tra quyền staff
      if (!isStaff()) {
        throw redirect({
          to: '/',
        });
      }
    }
  });
}

