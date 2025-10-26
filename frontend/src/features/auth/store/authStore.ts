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
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (data: { user: User; token: string }) => void;
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
        token: null,
        isAuthenticated: false,

        // Actions
        setAuth: (data: { user: User; token: string }) => set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        }),

        clearAuth: () => set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

        checkAuth: () => {
          const token = localStorage.getItem('accessToken');
          // Giả sử bạn có một hàm để giải mã token và lấy thông tin user
          // const user = decodeToken(token);
          // Tạm thời để là null
          const user = null;

          if (token && user) {
            set({
              isAuthenticated: true,
              user: user,
              token: token,
            });
          } else {
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
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    {
      name: 'auth-store'
    }
  )
);

// Selector hooks để tối ưu re-renders
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  setAuth: state.setAuth,
  clearAuth: state.clearAuth,
  checkAuth: state.checkAuth
}));

export const useAuthPermissions = () => useAuthStore((state) => ({
  hasRole: state.hasRole,
  isAdmin: state.isAdmin,
  isStaff: state.isStaff
}));
