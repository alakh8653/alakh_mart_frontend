import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { FC } from 'react'

export const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const add = useCartStore((s) => s.addItem)
  return (
    <div className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition p-2">
      <Link href={`/product/${product.id}`} className="block">
        <div className="w-full h-48 relative bg-white">
          <img src={product.images?.[0] ?? '/images/placeholder.png'} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="px-2 py-3">
          <h3 className="font-semibold text-sm leading-snug">{product.title}</h3>
          <div className="mt-2 text-sm text-gray-700">${product.price.amount.toFixed(2)}</div>
        </div>
      </Link>
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={() => add(product.id)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm"
        >
          Add to cart
        </button>
        <Link href={`/product/${product.id}`} className="text-sm px-3 py-2 border rounded-md">
          View
        </Link>
      </div>
    </div>
  )
}
