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
  const { id } = req.query as { id: string }
  
  try {
    const user = await authAdmin(req)
    if (!user) return res.status(403).json({ error: 'Unauthorized' })

    if (req.method === 'PUT') {
      // Update product
      const { title, description, priceAmount, categories, images, stock, featured } = req.body
      const updates: any = {}
      if (title !== undefined) updates.title = title
      if (description !== undefined) updates.description = description
      if (priceAmount !== undefined) updates.priceAmount = Number(priceAmount)
      if (categories) updates.categories = JSON.stringify(categories)
      if (images) updates.images = JSON.stringify(images)
      if (stock !== undefined) updates.stock = Number(stock)
      if (featured !== undefined) updates.featured = !!featured

      const product = await db.product.update({
        where: { id },
        data: updates
      })
      return res.json(product)
    } else if (req.method === 'DELETE') {
      // Delete product
      await db.product.delete({ where: { id } })
      return res.json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: String(e) })
  }
}
