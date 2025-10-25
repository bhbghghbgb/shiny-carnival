import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/management/suppliers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/management/Suppliers"!</div>
}
