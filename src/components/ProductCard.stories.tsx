import React from 'react'
import { ProductCard } from './ProductCard'
import { Product } from '@/types'

export default { title: 'ProductCard', component: ProductCard }

const product: Product = {
  id: 'p1',
  title: 'Sample Product',
  description: 'A great product',
  price: { amount: 49.99, currency: 'USD' },
  images: ['/images/placeholder.png'],
  rating: 4.5,
  reviews: 10,
  categories: ['General'],
  stock: 10,
}

export const Default = () => <ProductCard product={product} />
