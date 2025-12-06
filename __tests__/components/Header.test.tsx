import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/Header'

describe('Header', () => {
  it('renders brand and links', () => {
    render(<Header />)
    expect(screen.getByText(/alakhmart/i)).toBeInTheDocument()
    expect(screen.getByText(/products/i)).toBeInTheDocument()
  })
})
