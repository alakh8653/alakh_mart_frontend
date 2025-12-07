import { NextApiRequest, NextApiResponse } from 'next'
import db from '@/lib/db'

async function authAdmin(req: NextApiRequest) {
  const userRole = req.headers['x-user-role'] as string
  const userId = req.headers['x-user-id'] as string
  
  if (userRole !== 'admin') return null
  
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user?.isAdmin) return null
  
  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await authAdmin(req)
    if (!user) return res.status(403).json({ error: 'Unauthorized' })

    if (req.method === 'POST') {
      // Create product
      const { title, description, priceAmount, categories, images, stock, featured } = req.body
      const product = await db.product.create({
        data: {
          title: title || 'Untitled',
          description: description || '',
          priceAmount: Number(priceAmount) || 0,
          priceCurrency: 'USD',
          categories: JSON.stringify(categories || []),
          images: JSON.stringify(images || []),
          rating: 0,
          reviews: 0,
          stock: Number(stock) || 0,
          featured: !!featured,
        }
      })
      return res.json(product)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
}
