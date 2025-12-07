import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function Orders(){
  const [orders, setOrders] = useState<any[]>([])
  const { user } = useAuth()
  useEffect(() => {
    if (!user) return
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', { headers: { 'x-user-id': user.id } })
      if (!res.ok) return
      const data = await res.json()
      setOrders(data)
    }
    fetchOrders()
  }, [user])
  return (
    <div>
      <Head>
        <title>Orders - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div>No orders</div>
          ) : (
            orders.map(o => (
              <div key={o.id} className="border p-3 rounded">
                <div className="font-semibold">{o.id} — ${o.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{o.status} • {new Date(o.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
