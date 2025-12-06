import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CreateProduct() {
  const { data: session } = useSession()
  const user = session?.user as any
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    stock: '',
    categories: '',
    featured: false,
    images: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.isAdmin) return

    setLoading(true)
    try {
      const categories = formData.categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c)
      
      const images = formData.images
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i)

      const res = await fetch('/api/admin/products', {
        method: 'POST',
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
        alert('Failed to create product')
      }
    } catch (e) {
      alert('Error: ' + String(e))
    } finally {
      setLoading(false)
    }
  }

  if (!user?.isAdmin) return <div className="container mx-auto px-4 py-6">Not authorized</div>

  return (
    <div>
      <Head>
        <title>Create product - Admin</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Create product</h1>
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
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create product'}
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
      </main>
    </div>
  )
}
