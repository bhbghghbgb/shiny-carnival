// frontend/src/app/routes/modules/layout/main.layout.tsx
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import MainLayout from '../../../layouts/MainLayout';
import { Outlet } from '@tanstack/react-router';
import { requireAuth } from '../utils/routeGuards';

export const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: requireAuth, // Sử dụng utility function để nhất quán với các route khác
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
});
