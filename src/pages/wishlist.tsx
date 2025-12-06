import Head from 'next/head'
import { useWishlistStore } from '@/store/wishlistStore'
import { getProductById } from '@/lib/api-client'
import { useEffect, useState } from 'react'
import { Product } from '@/types'

export default function Wishlist(){
  const ids = useWishlistStore(s => s.ids)
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const results: Product[] = []
      await Promise.all(ids.map(async (id) => {
        try {
          const p = await getProductById(id)
          if (p) results.push(p)
        } catch (e) {
          // ignore
        }
      }))
      if (mounted) setItems(results)
    })()
    return () => { mounted = false }
  }, [ids])

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
