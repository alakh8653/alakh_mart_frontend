import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Product } from '@/types'

export default function AdminProducts() {
  const { data: session } = useSession()
  const user = session?.user as any
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user?.isAdmin) return
    ;(async () => {
      try {
        const res = await fetch('/api/products?limit=1000', {
          headers: { 'x-user-id': user.id, 'x-user-role': 'admin' }
        })
        const data = await res.json()
        setProducts(data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id, 'x-user-role': 'admin' }
      })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (e) {
      alert('Failed to delete')
    }
  }

  if (!user?.isAdmin) return <div className="container mx-auto px-4 py-6">Not authorized</div>

  return (
    <div>
      <Head>
        <title>Admin - Products</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Product management</h1>
          <Link href="/admin/products/create" className="bg-orange-500 text-white px-3 py-2 rounded">Create product</Link>
        </div>

        {loading ? (
          <div>Loading products...</div>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Featured</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">${p.price.amount.toFixed(2)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">{p.featured ? 'Yes' : 'No'}</td>
                    <td className="p-3 flex gap-2">
                      <Link href={`/admin/products/${p.id}`} className="text-blue-600 text-sm">Edit</Link>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-600 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
