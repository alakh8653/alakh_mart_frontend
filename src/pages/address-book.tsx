import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useAddressBookStore, Address, PaymentMethod } from '@/store/addressBookStore'

export default function AddressBook() {
  const { data: session } = useSession()
  const user = session?.user as any
  
  const addresses = useAddressBookStore((s) => s.addresses)
  const addAddress = useAddressBookStore((s) => s.addAddress)
  const updateAddress = useAddressBookStore((s) => s.updateAddress)
  const deleteAddress = useAddressBookStore((s) => s.deleteAddress)
  const setDefaultAddress = useAddressBookStore((s) => s.setDefaultAddress)

  const paymentMethods = useAddressBookStore((s) => s.paymentMethods)
  const addPaymentMethod = useAddressBookStore((s) => s.addPaymentMethod)
  const deletePaymentMethod = useAddressBookStore((s) => s.deletePaymentMethod)
  const setDefaultPaymentMethod = useAddressBookStore((s) => s.setDefaultPaymentMethod)

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [addressForm, setAddressForm] = useState({ name: '', address: '', city: '', state: '', zip: '', country: '', phone: '' })
  const [paymentForm, setPaymentForm] = useState({ type: 'card' as const, last4: '', brand: '' })

  if (!user) return <div className="container mx-auto px-4 py-6">Please log in</div>

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    addAddress({ ...addressForm, phone: addressForm.phone || undefined })
    setAddressForm({ name: '', address: '', city: '', state: '', zip: '', country: '', phone: '' })
    setShowAddressForm(false)
  }

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()
    addPaymentMethod({ ...paymentForm, isDefault: paymentMethods.length === 0 })
    setPaymentForm({ type: 'card', last4: '', brand: '' })
    setShowPaymentForm(false)
  }

  return (
    <div>
      <Head>
        <title>Address Book - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Address Book & Payment Methods</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Addresses */}
          <section className="border p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                {showAddressForm ? 'Cancel' : 'Add Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mb-4 p-3 bg-gray-50 rounded space-y-2">
                <input
                  type="text"
                  placeholder="Full name"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="State/Province"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                />
                <input
                  type="text"
                  placeholder="ZIP/Postal Code"
                  value={addressForm.zip}
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                />
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm w-full">Save</button>
              </form>
            )}

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="text-sm">
                      <div className="font-semibold">{addr.name}</div>
                      <div>{addr.address}</div>
                      <div>{addr.city}, {addr.state} {addr.zip}</div>
                      <div>{addr.country}</div>
                      {addr.phone && <div>{addr.phone}</div>}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className={`text-xs px-2 py-1 rounded ${addr.isDefault ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                      >
                        {addr.isDefault ? 'Default' : 'Set'}
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && <div className="text-sm text-gray-500">No addresses yet</div>}
            </div>
          </section>

          {/* Payment Methods */}
          <section className="border p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Payment Methods</h2>
              <button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                {showPaymentForm ? 'Cancel' : 'Add Method'}
              </button>
            </div>

            {showPaymentForm && (
              <form onSubmit={handleAddPayment} className="mb-4 p-3 bg-gray-50 rounded space-y-2">
                <select
                  value={paymentForm.type}
                  onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value as any })}
                  className="border px-2 py-1 w-full text-sm"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
                <input
                  type="text"
                  placeholder="Last 4 digits"
                  maxLength={4}
                  value={paymentForm.last4}
                  onChange={(e) => setPaymentForm({ ...paymentForm, last4: e.target.value })}
                  className="border px-2 py-1 w-full text-sm"
                  required
                />
                {paymentForm.type === 'card' && (
                  <input
                    type="text"
                    placeholder="Card brand (Visa, Mastercard, etc.)"
                    value={paymentForm.brand}
                    onChange={(e) => setPaymentForm({ ...paymentForm, brand: e.target.value })}
                    className="border px-2 py-1 w-full text-sm"
                  />
                )}
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm w-full">Save</button>
              </form>
            )}

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <div className="font-semibold">{method.type === 'card' ? `${method.brand || 'Card'} ****${method.last4}` : `PayPal ****${method.last4}`}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className={`text-xs px-2 py-1 rounded ${method.isDefault ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                      >
                        {method.isDefault ? 'Default' : 'Set'}
                      </button>
                      <button
                        onClick={() => deletePaymentMethod(method.id)}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {paymentMethods.length === 0 && <div className="text-sm text-gray-500">No payment methods yet</div>}
            </div>
          </section>
        </div>

        <div className="mt-6">
          <Link href="/account" className="text-blue-600">← Back to Account</Link>
        </div>
      </main>
    </div>
  )
}
