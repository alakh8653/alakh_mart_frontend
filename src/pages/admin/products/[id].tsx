import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Product } from '@/types'

export default function EditProduct() {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { data: session } = useSession()
  const user = session?.user as any

  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    stock: '',
    categories: '',
    featured: false,
    images: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id || !user?.isAdmin) return
    ;(async () => {
      try {
        const res = await fetch(`/api/products?id=${id}`)
        const data = await res.json()
        if (data) {
          setProduct(data)
          setFormData({
            title: data.title || '',
            description: data.description || '',
            priceAmount: String(data.price?.amount || ''),
            stock: String(data.stock || ''),
            categories: Array.isArray(data.categories) ? data.categories.join(', ') : '',
            featured: !!data.featured,
            images: Array.isArray(data.images) ? data.images.join(', ') : ''
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, user?.isAdmin])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.isAdmin || !product) return

    setSaving(true)
    try {
      const categories = formData.categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c)
      
      const images = formData.images
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i)

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-role': 'admin'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priceAmount: formData.priceAmount,
          stock: formData.stock,
          categories,
          images,
          featured: formData.featured
        })
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Failed to update product')
      }
    } catch (e) {
      alert('Error: ' + String(e))
    } finally {
      setSaving(false)
    }
  }

  if (!user?.isAdmin) return <div className="container mx-auto px-4 py-6">Not authorized</div>

  return (
    <div>
      <Head>
        <title>Edit product - Admin</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Edit product</h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl border p-6 rounded space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border px-3 py-2 w-full rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Price (USD)</label>
                <input
                  type="number"
                  name="priceAmount"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  step="0.01"
                  className="border px-3 py-2 w-full rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="border px-3 py-2 w-full rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Categories (comma-separated)</label>
              <input
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder="Electronics, Audio"
                className="border px-3 py-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Image URLs (comma-separated)</label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="/images/product-1.jpg"
                className="border px-3 py-2 w-full rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="font-semibold">Featured</label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
