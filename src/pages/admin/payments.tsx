import Head from 'next/head'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function AdminPayments(){
  const { user } = useAuth()
  // const [intents, setIntents] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // for demo, we can't list intents since payments are in-memory with no listing API; we'll let admin simulate by id
  }, [user])

  const simulate = async () => {
    const id = (document.getElementById('intent') as HTMLInputElement).value
    if (!id) return alert('Enter intent id')
    const res = await fetch('/api/payments/webhook/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-webhook-secret': 'demo-secret' }, body: JSON.stringify({ id }) })
    const data = await res.json()
    if (!res.ok) setError(data.error || 'Failed to simulate')
    else alert('Webhook simulation succeeded! Intent confirmed')
  }

  if (!user?.isAdmin) return <div className="container mx-auto px-4 py-6">Not authorized</div>

  return (
    <div className="container mx-auto px-4 py-6">
      <Head>
        <title>Admin - Payments</title>
      </Head>
      <h1 className="text-2xl font-semibold mb-4">Payments / Webhook simulator</h1>
      <div className="border p-4 rounded space-y-3">
        <div className="text-sm">Enter an existing intent id to simulate an external webhook confirming a payment intent (demo).</div>
        <input id="intent" className="border px-3 py-2 w-full max-w-md" placeholder="intent id" />
        <div>
          <button onClick={simulate} className="bg-orange-500 text-white px-3 py-2 rounded">Simulate webhook</button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  )
}
