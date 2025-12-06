import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function AdminOrders(){
  const [orders, setOrders] = useState<any[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !user.isAdmin) return
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', { headers: { 'x-user-id': user.id, 'x-user-role': 'admin' } })
      if (!res.ok) return
      const data = await res.json()
      setOrders(data)
    }
    fetchOrders()
  }, [user])

  if (!user || !user.isAdmin) return <div className="container mx-auto px-4 py-6">Not authorized</div>

  return (
    <div>
      <Head>
        <title>Admin - Orders</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Orders (Admin)</h1>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div>No orders</div>
          ) : (
            orders.map(o => (
              <div key={o.id} className="border p-3 rounded">
                <div className="font-semibold">{o.id} — ${o.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{o.status} • {o.createdAt} • User: {o.userId}</div>
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-sm">Status:</label>
                  <select defaultValue={o.status} onChange={async (e) => {
                    const res = await fetch(`/api/orders/${o.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-user-id': user.id, 'x-user-role': 'admin' }, body: JSON.stringify({ status: e.target.value }) })
                    if (res.ok) {
                      const updated = await res.json()
                      setOrders((prev) => prev.map((x) => x.id === updated.id ? updated : x))
                    }
                  }} className="border px-2 py-1 text-sm">
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <div className="mt-2"><Link href={`/order/${o.id}`} className="underline text-sm">View</Link></div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
