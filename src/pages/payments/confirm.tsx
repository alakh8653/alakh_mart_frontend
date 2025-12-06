import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function PaymentConfirm(){
  const router = useRouter()
  const { intent, order } = router.query as any
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const { user } = useAuth()

  const confirm = async () => {
    setLoading(true)
    // include x-user-id header to ensure authorization mapping
    const res = await fetch('/api/payments/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id ?? '', 'x-user-role': user?.isAdmin ? 'admin' : 'user' }, body: JSON.stringify({ id: intent }) })
    if (res.ok) {
      setStatus('succeeded')
      router.push(`/order/${order}`)
    } else {
      setStatus('failed')
    }
    setLoading(false)
  }

  if (!intent) return <div className="container mx-auto px-4 py-6">No intent provided</div>
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Confirm payment</h1>
      <div className="border p-4 rounded">
        <div>Intent: {intent}</div>
        <div>Order: {order}</div>
        <div className="mt-4">
          <button disabled={loading} onClick={confirm} className="bg-orange-500 text-white px-3 py-2 rounded">Simulate payment</button>
        </div>
        {status && <div className="mt-3">Status: {status}</div>}
      </div>
    </div>
  )
}
