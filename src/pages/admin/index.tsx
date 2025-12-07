import Head from 'next/head'
import Link from 'next/link'
// Layout provides Header/Footer

export default function Admin(){
  return (
    <div>
      <Head>
        <title>Admin - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 border p-4 rounded">Orders management (placeholder)</div>
          <aside className="border p-4 rounded">Stats and quick actions<br /><Link href="/admin/orders" className="text-sm underline">Orders</Link></aside>
        </div>
      </main>
      {/* Layout includes Header and Footer */}
    </div>
  )
}
