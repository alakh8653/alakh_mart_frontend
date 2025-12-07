import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Order } from '@/types'

export default function OrderPage(){
  const router = useRouter()
  const { id } = router.query as { id?: string }
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!id) return
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders?id=${id}`, { headers: { 'x-user-id': user?.id ?? '', 'x-user-role': user?.isAdmin ? 'admin' : 'user' } })
      if (!res.ok) {
        setError((await res.json()).error || 'Failed to load')
        setOrder(null)
        return
      }
      setOrder(await res.json())
    }
    fetchOrder()
  }, [id, user])

  if (order === undefined) return <div className="container mx-auto px-4 py-6">Loading…</div>
  if (!order) return <div className="container mx-auto px-4 py-6">{error ?? 'Not found'}</div>
  return (
    <div className="container mx-auto px-4 py-6">
      <Head>
        <title>Order {order.id} - AlakhMart</title>
      </Head>
      <h1 className="text-2xl font-semibold mb-4">Order placed</h1>
      <div className="border p-4 rounded-md">
        <div className="font-semibold">Order ID: {order.id}</div>
        <div className="mt-1 text-sm">Placed: {new Date(order.createdAt).toLocaleString()}</div>
        <div className="mt-2">Status: {order.status}</div>
        <div className="mt-2">Total: ${order.total.toFixed(2)}</div>
        <div className="mt-2">Shipping: {order.shipping.name}, {order.shipping.address}, {order.shipping.city}</div>
      </div>
    </div>
  )
}
