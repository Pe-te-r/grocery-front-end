// src/routes/dashboard/orders/current.tsx
import {  } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Check, Truck, PackageCheck, Clock3 } from 'lucide-react'
import { useGetCustomerOrders } from '@/hooks/customerHook'
import { getUserIdHelper } from '@/lib/authHelper'

export const Route = createFileRoute('/dashboard/orders/current')({
  component: RouteComponent,
})

function getStatusText(status: string) {
  switch (status) {
    case 'pending':
      return 'Packaging your items'
    case 'ready_for_pickup':
      return 'Waiting for delivery to pick station'
    case 'in_transit':
      return 'On the way to pickup station'
    case 'completed':
      return 'Ready for pickup'
    case 'cancelled':
      return 'Order was cancelled'
    case 'rejected':
      return 'Order was rejected'
    default:
      return 'Processing'
  }
}

function RouteComponent() {
  const userId = getUserIdHelper() ?? ''
  const {
    data: orderData,
    isLoading,
    refetch,
  } = useGetCustomerOrders(userId)

  useEffect(() => {
    refetch()
  }, [])

  if (isLoading) return <div className="text-green-600 p-4">Loading orders...</div>

  if (!orderData?.data?.length) {
    return <div className="text-green-600 p-4">You have no orders.</div>
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Your Orders</h2>

      {orderData.data.map((order: any) => (
        <div
          key={order.id}
          className="border border-green-300 rounded-xl p-4 bg-green-50 shadow-md"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold text-green-700">Order ID: {order.id}</p>
              <p className="text-sm text-green-600">
                Status: {getStatusText(order.status)}
              </p>
              <p className="text-sm text-green-600">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                Total Amount: KES {order.totalAmount}
              </p>
            </div>
            <div>
              {order.status === 'completed' ? (
                <PackageCheck className="text-green-600" />
              ) : order.status === 'in_transit' ? (
                <Truck className="text-green-600" />
              ) : order.status === 'pending' ? (
                <Clock3 className="text-green-600" />
              ) : (
                <Check className="text-green-600" />
              )}
            </div>
          </div>

          {order.pickStation && (
            <div className="bg-white p-2 rounded mb-3">
              <p className="text-sm text-green-700 font-medium">
                Pickup Station: {order.pickStation.name}
              </p>
              <p className="text-xs text-green-600">
                Contact: {order.pickStation.contactPhone}
              </p>
              <p className="text-xs text-green-600">
                Hours: {order.pickStation.openingTime} - {order.pickStation.closingTime}
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded border border-green-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800">{item.product.name}</p>
                    <p className="text-sm text-green-600">Qty: {item.quantity}</p>
                    <p className="text-sm text-green-600">
                      Vendor: {item.vendor.businessName} ({item.vendor.location})
                    </p>
                    <p className="text-sm text-green-600">
                      Status: {getStatusText(item.itemStatus)}
                    </p>
                    <p className="text-sm text-green-600">
                      Price: KES {item.product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
