import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'

const product = {
  id: 'p1',
  title: 'Test Product',
  description: 'A test product',
  price: { amount: 24.99, currency: 'USD' },
  images: ['/images/placeholder.png'],
  rating: 4.1,
  reviews: 12,
  categories: ['Gadgets'],
  stock: 10,
}

describe('ProductCard', () => {
  it('renders title and price', () => {
    render(<ProductCard product={product as any} />)
    expect(screen.getByText(/test product/i)).toBeInTheDocument()
    expect(screen.getByText(/\$24.99/)).toBeInTheDocument()
  })
})
