import { NextPage } from 'next'
import Head from 'next/head'
// Header and Footer are provided by Layout
import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ProductList } from '@/components/ProductList'
import { Pagination } from '@/components/Pagination'

const Search: NextPage = () => {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const { items, total, loading } = useProducts({ limit: 24, q, page })

  return (
    <div>
      <Head>
        <title>Search - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Search</h1>
        <div className="mb-6 flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="w-full px-3 py-2 border rounded-md" />
        </div>
        {loading ? <div>Loading…</div> : <ProductList items={items} />}
        <div className="mt-6">
          <Pagination page={page} total={total ?? 0} perPage={24} onPage={setPage} />
        </div>
      </main>
      {/* Layout includes Header and Footer */}
    </div>
  )
}

export default Search
