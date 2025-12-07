import type { NextPage } from 'next'
import Head from 'next/head'
// Header and Footer are provided by Layout
import { useProducts } from '@/hooks/useProducts'
import { useState } from 'react'
import { ProductList } from '@/components/ProductList'
import { Filters } from '@/components/Filters'

const Home: NextPage = () => {
  const [category, setCategory] = useState<string | undefined>()
  const { items, loading } = useProducts({ limit: 12, category })
  return (
    <div>
      <Head>
        <title>AlakhMart - Your Marketplace</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6">Featured products</h1>
        <div className="grid md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <Filters onFilter={(f) => setCategory(f?.category)} />
          </aside>
          <div className="md:col-span-3">
            {loading ? (
              <div>Loading…</div>
            ) : (
              <ProductList items={items} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
