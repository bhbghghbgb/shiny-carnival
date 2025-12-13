// frontend/src/app/routes/modules/layout/main.layout.tsx
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import MainLayout from '../../../layouts/MainLayout';
import { Outlet } from '@tanstack/react-router';

export const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
});
