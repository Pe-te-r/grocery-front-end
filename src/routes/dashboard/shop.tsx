import { createFileRoute } from '@tanstack/react-router'
import { ProductsRouteComponent } from '../products'

export const Route = createFileRoute('/dashboard/shop')({
  component: ProductsRouteComponent,
})

