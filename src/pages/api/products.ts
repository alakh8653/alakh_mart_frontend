import { NextApiRequest, NextApiResponse } from 'next'
import { getProducts, getProductById } from '@/lib/api-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, q, category, page = '1', limit = '12' } = req.query as any
  if (id) {
    try {
      const p = await getProductById(id)
      if (!p) return res.status(404).json({ message: 'Not found' })
      return res.json(p)
    } catch (e) {
      return res.status(500).json({ message: 'Backend error' })
    }
  }
  try {
    const data = await getProducts({ q, category, page: Number(page), limit: Number(limit) })
    return res.json(data)
  } catch (e) {
    return res.status(500).json({ message: 'Backend error' })
  }
}
