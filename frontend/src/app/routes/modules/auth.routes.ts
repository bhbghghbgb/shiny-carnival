import type { ModuleRoutes } from '../type/types';
import { LoginPage } from '../../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../../features/auth/pages/ResetPasswordPage';
import { ProfilePage } from '../../../features/profile/pages/ProfilePage';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { useAuthStore } from '../../../features/auth/store/authStore';

// Auth module routes configuration with hierarchical structure
export const authRoutes: ModuleRoutes<any> = {
  moduleName: 'auth',
  basePath: '/auth',
  routes: [
    {
      path: '/auth', // Parent route for grouping
      children: [
        {
          path: 'login',
          component: LoginPage,
          pendingComponent: PendingComponent,
          meta: {
            title: 'Đăng nhập',
            description: 'Trang đăng nhập hệ thống',
            requiresAuth: false,
          },
        },
        {
          path: 'register',
          component: RegisterPage,
          pendingComponent: PendingComponent,
          meta: {
            title: 'Đăng ký',
            description: 'Trang đăng ký tài khoản mới',
            requiresAuth: false,
          },
        },
        {
          path: 'forgot-password',
          component: ForgotPasswordPage,
          pendingComponent: PendingComponent,
          meta: {
            title: 'Quên mật khẩu',
            description: 'Trang khôi phục mật khẩu',
            requiresAuth: false,
          },
        },
        {
          path: 'reset-password',
          component: ResetPasswordPage,
          pendingComponent: PendingComponent,
          meta: {
            title: 'Đặt lại mật khẩu',
            description: 'Trang đặt lại mật khẩu mới',
            requiresAuth: false,
          },
        },
        {
          path: 'profile',
          component: ProfilePage,
          pendingComponent: PendingComponent,
          beforeLoad: () => {
            // Guard: Kiểm tra đăng nhập trước khi load trang
            const { isAuthenticated } = useAuthStore.getState();
            if (!isAuthenticated) {
              // Trả về context rỗng, component sẽ xử lý hiển thị Alert
              return {};
            }
            return {};
          },
          meta: {
            title: 'Hồ sơ cá nhân',
            description: 'Trang quản lý hồ sơ cá nhân và đơn hàng',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
};
