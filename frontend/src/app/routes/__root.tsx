import { createRootRoute, Outlet } from '@tanstack/react-router'
import MainLayout from '../../layouts/MainLayout'

export const rootRoute = createRootRoute({
  component: () => (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ),
})

