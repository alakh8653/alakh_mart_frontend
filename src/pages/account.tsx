import Head from 'next/head'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
// Header/Footer are provided by Layout

export default function Account(){
  const { user, logout } = useAuth()
  return (
    <div>
      <Head>
        <title>My Account - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 border p-4 rounded">
            <div className="font-semibold mb-3">Profile & settings</div>
            <div className="text-sm">Signed in as {user?.email}</div>
            <div className="mt-4 space-y-2">
              <div><Link href="/address-book" className="text-blue-600 text-sm">Address Book & Payments</Link></div>
              <div><button className="px-3 py-1 border rounded text-sm" onClick={() => logout()}>Sign out</button></div>
            </div>
          </div>
          <div className="col-span-2 border p-4 rounded space-y-3">
            <div className="font-semibold">Quick links</div>
            <div><Link href="/orders" className="text-blue-600 text-sm">My orders</Link></div>
            <div><Link href="/wishlist" className="text-blue-600 text-sm">Wishlist</Link></div>
            <div><Link href="/cart" className="text-blue-600 text-sm">Shopping cart</Link></div>
          </div>
        </div>
      </main>
      {/* Layout includes Header and Footer */}
    </div>
  )
}
