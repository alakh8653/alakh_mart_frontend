import type { NextPage } from 'next'
import Head from 'next/head'
// Header and Footer are provided by Layout
import { useProducts } from '@/hooks/useProducts'
import { useState } from 'react'
import { ProductList } from '@/components/ProductList'
import { Filters } from '@/components/Filters'

const Home: NextPage = () => {
  const [category, setCategory] = useState<string | undefined>()
  const [page, setPage] = useState<number>(1)
  const limit = 12
  const { items, total, loading } = useProducts({ limit, category, page })
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
              <>
                <ProductList items={items} />
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">
                    Prev
                  </button>
                  {total ? (
                    <div className="text-sm text-gray-600">Page {page} of {Math.max(1, Math.ceil((total || 0) / limit))}</div>
                  ) : (
                    <div className="text-sm text-gray-600">Page {page}</div>
                  )}
                  <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
