// frontend/src/app/routes/modules/layout/auth.layout.tsx
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../__root';
import AuthLayout from '../../../../layouts/AuthLayout';
import { Outlet } from '@tanstack/react-router';

export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
});

