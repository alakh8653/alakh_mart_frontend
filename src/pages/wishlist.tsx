import Head from 'next/head'
import { useWishlistStore } from '@/store/wishlistStore'
import { sampleProducts } from '@/lib/mock-api'

export default function Wishlist(){
  const ids = useWishlistStore(s => s.ids)
  const items = ids.map(i => sampleProducts.find(p => p.id === i)).filter(Boolean)
  return (
    <div>
      <Head>
        <title>Wishlist - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Saved items</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.length === 0 ? <div>No saved items</div> : items.map((p:any) => (
            <div key={p.id} className="border p-3 rounded">{p.title}</div>
          ))}
        </div>
      </main>
    </div>
  )
}
