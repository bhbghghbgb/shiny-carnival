import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/management/categories')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/management/categories"!</div>
}
