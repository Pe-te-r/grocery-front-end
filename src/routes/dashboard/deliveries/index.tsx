import DriverOrderHistory from '@/components/DriverOrderHistory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deliveries/')({
  component: DriverOrderHistory,
})


