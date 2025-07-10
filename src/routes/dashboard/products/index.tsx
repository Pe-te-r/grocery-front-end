import { ProductsRouteComponent } from '@/routes/products'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/products/')({
  component: ProductsRouteComponent,
})

