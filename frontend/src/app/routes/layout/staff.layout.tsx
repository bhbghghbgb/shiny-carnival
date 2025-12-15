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
      const { isAuthenticated } = useAuthStore.getState();

      // Kiểm tra xem user đã đăng nhập chưa
      if (!isAuthenticated) {
        // Redirect đến trang login
        throw redirect({
          to: '/auth/login' as any,
        });
      }

      // Kiểm tra quyền staff - chỉ Staff được truy cập, Admin không được
      // Admin có role === 0, Staff có role === 1
      const { user } = useAuthStore.getState();
      if (!user || user.role !== 1) {
        throw redirect({
          to: '/auth/unauthorized' as any,
        });
      }
    }
  });
}

