import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


// Types cho Auth Store
interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (data: { user: User }) => void;
  clearAuth: () => void;
  checkAuth: () => void;

  // Utility methods
  hasRole: (requiredRole: number) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,

        // Actions
        setAuth: (data: { user: User }) => {
          set({
            user: data.user,
            isAuthenticated: true,
          });
        },

        clearAuth: () => {
          set({
            user: null,
            isAuthenticated: false,
          });
        },

        checkAuth: () => {
          // Với httpOnly cookies, không thể đọc token từ frontend
          // Chỉ kiểm tra xem có user trong store không
          const { user } = get();
          if (!user) {
            get().clearAuth();
          }
        },

        // Utility methods
        hasRole: (requiredRole: number) => {
          const { user } = get();
          if (!user) return false;

          // Admin có tất cả quyền
          if (user.role === 0) return true;

          return user.role === requiredRole;
        },

        isAdmin: () => {
          return get().hasRole(0);
        },

        isStaff: () => {
          return get().hasRole(1);
        }
      }),
      {
        name: 'auth-store',
        partialize: (state) => {
          return {
            user: state.user,
            isAuthenticated: state.isAuthenticated
          };
        },
      }
    ),
    {
      name: 'auth-store'
    }
  )
);

// Selector hooks để tối ưu re-renders
// Hook này subscribe vào state và tự động re-render component khi state thay đổi
// Sử dụng cho các component cần hiển thị user info và tự động cập nhật
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}));

// Lưu ý: Actions và Permissions nên dùng getState() để tránh re-render không cần thiết
// 
// Actions (không cần subscribe):
//   useAuthStore.getState().setAuth({ user })
//   useAuthStore.getState().clearAuth()
//   useAuthStore.getState().checkAuth()
//
// Permissions (không cần subscribe):
//   useAuthStore.getState().isAdmin()
//   useAuthStore.getState().isStaff()
//   useAuthStore.getState().hasRole(role)
//
// Nếu cần subscribe permissions (hiếm khi cần):
//   const isAdmin = useAuthStore((state) => state.isAdmin());
//   const hasRole = useAuthStore((state) => state.hasRole(role));
