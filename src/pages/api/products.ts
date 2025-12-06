import { NextApiRequest, NextApiResponse } from 'next'
import { getProducts, getProductById } from '@/lib/mock-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, q, category, page = '1', limit = '12' } = req.query as any
  if (id) {
    const p = await getProductById(id)
    if (!p) return res.status(404).json({ message: 'Not found' })
    return res.json(p)
  }
  const items = await getProducts({ q, category, page: Number(page), limit: Number(limit) })
  res.json(items)
}
