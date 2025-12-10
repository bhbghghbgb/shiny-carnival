// frontend/src/app/routes/modules/layout/admin.layout.ts
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../__root';

// Lưu ý: adminLayoutRoute sẽ được thêm vào mainLayoutRoute trong routeTree.ts
// Không dùng getParentRoute để tránh duplicate route id
export const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute, // Tạm thời dùng rootRoute, sẽ được override trong routeTree
  path: '/admin',
  beforeLoad: async ({ context }) => {
    // Logic kiểm tra quyền admin ở đây
    // Ví dụ: if (!context.auth.isAdmin) { throw redirect(...) }
    console.log("Kiểm tra quyền admin trong beforeLoad của adminLayoutRoute");
  }
});

