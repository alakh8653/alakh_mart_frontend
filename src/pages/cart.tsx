import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// Header/Footer are provided by Layout
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { getProductById } from '@/lib/api-client'
import { Product } from '@/types'

const CartPage = () => {
  const items = useCartStore((s) => s.items)
  const remove = useCartStore((s) => s.removeItem)
  const update = useCartStore((s) => s.updateItem)
  const add = useCartStore((s) => s.addItem)
  const wishlistIds = useWishlistStore((s) => s.ids)
  const wishlistToggle = useWishlistStore((s) => s.toggle)

  const [productsMap, setProductsMap] = useState<Record<string, Product | null>>({})

  useEffect(() => {
    // load products for cart and wishlist
    const ids = Array.from(new Set([...items.map((i) => i.productId), ...wishlistIds]))
    let mounted = true
    ;(async () => {
      const map: Record<string, Product | null> = {}
      await Promise.all(ids.map(async (id) => {
        try {
          map[id] = await getProductById(id)
        } catch (e) {
          map[id] = null
        }
      }))
      if (mounted) setProductsMap(map)
    })()
    return () => { mounted = false }
  }, [items, wishlistIds])

  const fullItems = items.map((it) => ({ item: it, product: productsMap[it.productId] }))
  const savedItems = wishlistIds.map((id) => ({ id, product: productsMap[id] }))

  const totalPrice = fullItems.reduce((acc, cur) => acc + (cur.product?.price.amount ?? 0) * cur.item.quantity, 0)

  const saveForLater = (productId: string) => {
    // add to wishlist and remove from cart
    wishlistToggle(productId)
    remove(productId)
  }

  const moveToCart = (productId: string) => {
    // remove from wishlist and add to cart with qty=1
    wishlistToggle(productId)
    add(productId, 1)
  }

  return (
    <div>
      <Head>
        <title>Cart - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Your cart</h1>
        {fullItems.length === 0 ? (
          <div className="text-gray-600">No items in your cart</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {fullItems.map(({ item, product }) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-md">
                  <img src={product?.images?.[0]} alt={product?.title} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="font-semibold">{product?.title}</div>
                    <div className="text-sm text-gray-600">${product?.price.amount.toFixed(2)}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="border px-2 rounded"
                        onClick={() => update(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <div>{item.quantity}</div>
                      <button className="border px-2 rounded" onClick={() => update(item.productId, item.quantity + 1)}>
                        +
                      </button>
                      <button className="ml-4 text-sm text-red-600" onClick={() => remove(item.productId)}>
                        Remove
                      </button>
                      <button className="ml-4 text-sm text-blue-600" onClick={() => saveForLater(item.productId)}>
                        Save for later
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <aside className="md:col-span-1 border p-4 rounded-md">
              <div className="text-lg font-semibold">Summary</div>
              <div className="mt-2 text-sm">Total: ${totalPrice.toFixed(2)}</div>
              <div className="mt-4">
                <Link href="/checkout" className="bg-orange-500 text-white px-4 py-3 rounded-md block text-center">Proceed to Checkout</Link>
              </div>
            </aside>
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Saved for later</h2>
          {savedItems.length === 0 ? (
            <div className="text-gray-500">No items saved for later</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {savedItems.map(({ id, product }) => (
                <div key={id} className="p-4 border rounded-md flex items-center gap-4">
                  <img src={product?.images?.[0]} alt={product?.title} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="font-semibold">{product?.title}</div>
                    <div className="text-sm text-gray-600">${product?.price.amount.toFixed(2)}</div>
                    <div className="mt-2">
                      <button className="text-sm text-blue-600" onClick={() => moveToCart(id)}>Move to cart</button>
                      <button className="ml-4 text-sm text-red-600" onClick={() => wishlistToggle(id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      {/* Layout includes Header and Footer */}
    </div>
  )
}

export default CartPage
