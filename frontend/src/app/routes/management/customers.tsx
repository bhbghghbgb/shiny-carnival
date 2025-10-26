import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/management/customers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/management/Customers"!</div>
}
