// frontend/src/app/routes/modules/layout/admin.layout.tsx
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../__root'

export const adminLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
})
