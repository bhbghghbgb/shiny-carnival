import { createRootRoute, Outlet } from '@tanstack/react-router'
import { queryClient } from '../../lib/query/queryClient'
import type { QueryClient } from '@tanstack/react-query'

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  context: () => ({
    queryClient,
  }),
})

declare module '@tanstack/react-router' {
  interface Register {
    routerContext: {
      queryClient: QueryClient
    }
  }
}

