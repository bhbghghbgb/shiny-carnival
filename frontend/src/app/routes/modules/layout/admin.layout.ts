// frontend/src/app/routes/modules/layout/admin.layout.ts
import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '../../__root';
import { useAuthStore } from '../../../../features/auth/store/authStore';

// Lưu ý: adminLayoutRoute sẽ được thêm vào mainLayoutRoute trong routeTree.ts
// Không dùng getParentRoute để tránh duplicate route id
export const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute, // Tạm thời dùng rootRoute, sẽ được override trong routeTree
  path: '/admin',
  beforeLoad: async () => {
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

