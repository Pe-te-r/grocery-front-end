import { Unauthorized } from '@/components/Unauthorized'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/Unauthorized')({
  component: Unauthorized,
})
