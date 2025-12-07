import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { FC } from 'react'

export const ProductList: FC<{ items?: Product[] }> = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
