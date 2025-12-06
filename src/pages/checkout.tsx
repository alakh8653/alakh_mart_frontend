import Head from 'next/head'
// Header/Footer are provided by Layout
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { useAddressBookStore } from '@/store/addressBookStore'
import { useState } from 'react'
import { useRouter } from 'next/router'

const Checkout = () => {
  const items = useCartStore((s) => s.items)
  const addresses = useAddressBookStore((s) => s.addresses)
  const paymentMethods = useAddressBookStore((s) => s.paymentMethods)

  const [selectedAddress, setSelectedAddress] = useState(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || '')
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0]?.id || '')
  const [customShipping, setCustomShipping] = useState({ name: '', address: '', city: '', state: '', zip: '', country: '' })
  const [useCustomAddress, setUseCustomAddress] = useState(false)

  const router = useRouter()

  const { user } = useAuth()

  const submitOrder = async () => {
    if (!user) {
      router.push(`/login?next=/checkout`)
      return
    }
    if (items.length === 0) return alert('Cart is empty')
    
    let shipping = customShipping
    if (!useCustomAddress && selectedAddress) {
      const addr = addresses.find((a) => a.id === selectedAddress)
      if (addr) {
        shipping = { name: addr.name, address: addr.address, city: addr.city, state: addr.state, zip: addr.zip, country: addr.country }
      }
    }

    if (!shipping.name || !shipping.address || !shipping.zip || !shipping.country) {
      return alert('Please provide or select a shipping address')
    }

    // Lookup unit prices from backend products
    let orderTotal = 0
    await Promise.all(items.map(async (it) => {
      try {
        const p = await (await import('@/lib/api-client')).getProductById(it.productId)
        orderTotal += (p?.price?.amount ?? 0) * it.quantity
      } catch (e) {
        // ignore missing product
      }
    }))
    
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id ?? '', 'x-user-role': user?.isAdmin ? 'admin' : 'user' },
      body: JSON.stringify({ items, total: orderTotal, shipping }),
    })
    if (!res.ok) {
      alert('Failed to place order')
      return
    }
    const data = await res.json()
    // create a payment intent for the order
    const p = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id ?? '', 'x-user-role': user?.isAdmin ? 'admin' : 'user' },
      body: JSON.stringify({ orderId: data.id, amount: orderTotal }),
    })
    const pi = await p.json()
    // attach paymentIntent to order
    await fetch(`/api/orders/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-user-id': user?.id ?? '', 'x-user-role': user?.isAdmin ? 'admin' : 'user' },
      body: JSON.stringify({ paymentIntentId: pi.id }),
    })
    // Clear cart, navigate to payment confirmation
    useCartStore.getState().clear()
    router.push(`/payments/confirm?intent=${encodeURIComponent(pi.id)}&order=${encodeURIComponent(data.id)}`)
  }

  return (
    <div>
      <Head>
        <title>Checkout - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        {items.length === 0 ? <div>Your cart is empty.</div> : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="border p-4 rounded">
                <h2 className="font-semibold mb-3">Shipping address</h2>
                
                {addresses.length > 0 && (
                  <div className="mb-4">
                    <label className="block font-semibold text-sm mb-2">
                      <input
                        type="radio"
                        checked={!useCustomAddress}
                        onChange={() => setUseCustomAddress(false)}
                        className="mr-2"
                      />
                      Use saved address
                    </label>
                    {!useCustomAddress && (
                      <select
                        value={selectedAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="border px-3 py-2 w-full text-sm"
                      >
                        {addresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.name} - {addr.address}, {addr.city}, {addr.zip}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <label className="block font-semibold text-sm mb-2">
                  <input
                    type="radio"
                    checked={useCustomAddress}
                    onChange={() => setUseCustomAddress(true)}
                    className="mr-2"
                  />
                  Use custom address
                </label>

                {useCustomAddress && (
                  <div className="space-y-2">
                    <input value={customShipping.name} onChange={(e) => setCustomShipping({ ...customShipping, name: e.target.value })} placeholder="Full name" className="border w-full px-3 py-2 text-sm" required />
                    <input value={customShipping.address} onChange={(e) => setCustomShipping({ ...customShipping, address: e.target.value })} placeholder="Address" className="border w-full px-3 py-2 text-sm" required />
                    <input value={customShipping.city} onChange={(e) => setCustomShipping({ ...customShipping, city: e.target.value })} placeholder="City" className="border w-full px-3 py-2 text-sm" />
                    <input value={customShipping.state} onChange={(e) => setCustomShipping({ ...customShipping, state: e.target.value })} placeholder="State/Province" className="border w-full px-3 py-2 text-sm" />
                    <input value={customShipping.zip} onChange={(e) => setCustomShipping({ ...customShipping, zip: e.target.value })} placeholder="ZIP/Postal Code" className="border w-full px-3 py-2 text-sm" required />
                    <input value={customShipping.country} onChange={(e) => setCustomShipping({ ...customShipping, country: e.target.value })} placeholder="Country" className="border w-full px-3 py-2 text-sm" required />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              {paymentMethods.length > 0 && (
                <div className="border p-4 rounded">
                  <h2 className="font-semibold mb-3">Payment method</h2>
                  <select
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="border px-3 py-2 w-full text-sm"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.type === 'card' ? `${method.brand || 'Card'} ****${method.last4}` : `PayPal ****${method.last4}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="border p-4 rounded h-fit">
              <h2 className="font-semibold mb-3">Order summary</h2>
              <div className="text-sm text-gray-600 mb-3">Items: {items.length}</div>
              <button onClick={submitOrder} className="bg-orange-500 text-white px-4 py-2 rounded w-full">Place order</button>
            </div>
          </div>
        )}
      </main>
      {/* Layout includes Header and Footer */}
    </div>
  )
}

export default Checkout
