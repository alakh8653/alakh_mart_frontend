import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
// Layout provides Header/Footer
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { ProductReviews } from '@/components/ProductReviews'
import { getProductById, getProducts, sampleProducts } from '@/lib/mock-api'
import { useState } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'

const ProductPage: NextPage<{ product: Product | null | undefined; related: Product[] }> = ({ product: initialProduct, related = [] }) => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { product = initialProduct, loading } = { product: initialProduct, loading: !initialProduct }
  const add = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const hasInWishlist = useWishlistStore((s) => s.has)
  const [qty, setQty] = useState(1)
  if (!id) return null

  return (
    <div>
      <Head>
        <title>{product?.title ?? 'Product'} - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div>Loading product…</div>
        ) : product ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <img src={product.images?.[0] ?? '/images/placeholder.png'} alt={product.title} className="w-full h-96 object-cover" />
                <ProductReviews product={product} />
              </div>
              <div className="col-span-1">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <div className="text-xl text-gray-900 mt-2">${product.price.amount.toFixed(2)}</div>
                <div className="mt-4 text-gray-600">{product.description}</div>
                <div className="mt-6 flex gap-3 items-center">
                  <div className="flex items-center border rounded">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3">-</button>
                    <div className="px-4">{qty}</div>
                    <button onClick={() => setQty(qty + 1)} className="px-3">+</button>
                  </div>
                  <button onClick={() => add(product.id, qty)} className="bg-orange-500 text-white px-4 py-3 rounded-md">Add to cart</button>
                  <button onClick={() => toggleWishlist(product.id)} className={`px-3 py-2 border rounded ${hasInWishlist(product.id) ? 'bg-red-100' : ''}`}>
                    {hasInWishlist(product.id) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Related products</h2>
              {related.length === 0 ? (
                <div className="text-gray-500">No related products</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {related.map((r) => (
                    <LinkCard key={r.id} product={r} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div>Product not found</div>
        )}
      </main>
      {/* Header/Footer via Layout */}
    </div>
  )
}

function LinkCard({ product }: { product: Product }) {
  return (
    <div className="border rounded p-3">
      <img src={product.images?.[0]} alt={product.title} className="w-full h-36 object-cover mb-2 rounded" />
      <div className="font-semibold text-sm">{product.title}</div>
      <div className="text-sm text-gray-600">${product.price.amount.toFixed(2)}</div>
      <div className="mt-2">
        <a href={`/product/${product.id}`} className="text-blue-600 text-sm">View</a>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const paths = sampleProducts.map((p) => ({ params: { id: p.id } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }: any) {
  const id = params?.id as string
  const product = await getProductById(id)
  let related: Product[] = []
  try {
    const cat = Array.isArray(product?.categories) ? product?.categories[0] : undefined
    if (cat) {
      const r = await getProducts({ category: cat, limit: 6 })
      related = r.items.filter((p) => p.id !== id).slice(0, 6)
    }
  } catch (e) {
    // ignore
  }

  return {
    props: { product, related },
    revalidate: 60,
  }
}

export default ProductPage
