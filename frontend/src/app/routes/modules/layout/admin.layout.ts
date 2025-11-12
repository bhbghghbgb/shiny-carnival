// frontend/src/app/routes/modules/layout/admin.layout.ts
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../__root';

export const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: async ({ context }) => {
    // Logic kiểm tra quyền admin ở đây
    // Ví dụ: if (!context.auth.isAdmin) { throw redirect(...) }
    console.log("Kiểm tra quyền admin trong beforeLoad của adminLayoutRoute");
  }
});

