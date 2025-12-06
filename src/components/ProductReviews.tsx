import { Product } from '@/types'
import { FC } from 'react'

export const ProductReviews: FC<{ product?: Product }> = ({ product }) => {
  if (!product) return null
  return (
    <div className="border p-4 rounded-md"> 
      <div className="font-semibold">Customer reviews</div>
      <div className="mt-2 text-sm text-gray-600">{product.reviews} reviews — Average rating {product.rating}</div>
      <div className="mt-4">Placeholder for review list and create review form.</div>
    </div>
  )
}
