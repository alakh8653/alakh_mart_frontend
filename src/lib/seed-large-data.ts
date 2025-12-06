import { Product } from '@/types'

const base: Omit<Product, 'id'> = {
  title: 'Generic Product',
  description: 'A useful product description',
  price: { amount: 10, currency: 'USD' },
  images: ['/images/placeholder.png'],
  rating: 4.2,
  reviews: 12,
  categories: ['General'],
  stock: 100,
}

export function seedProducts(count: number): Product[] {
  const arr: Product[] = []
  for (let i = 1; i <= count; i++) {
    arr.push({
      ...base,
      id: `auto-${i}`,
      title: `${base.title} ${i}`,
      price: { amount: base.price.amount + (i % 100), currency: 'USD' },
      rating: 3 + (i % 3) + (i % 10) / 10,
      reviews: (i * 13) % 500,
      categories: i % 3 === 0 ? ['Electronics'] : ['General'],
    })
  }
  return arr
}

