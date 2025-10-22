import { createFileRoute } from '@tanstack/react-router'
import { ProductManagementPage } from '../../features/products/pages/ProductManagementPage'

export const Route = createFileRoute('/products')({
  component: ProductManagementPage,
})
