import { NextApiRequest, NextApiResponse } from 'next'
import db from '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await db.product.findMany({ select: { categories: true } })
    const set = new Set<string>()
    products.forEach((p) => {
      try {
        const arr = JSON.parse(p.categories)
        if (Array.isArray(arr)) arr.forEach((c: string) => set.add(c))
      } catch (e) {
        if (typeof p.categories === 'string') set.add(p.categories)
      }
    })
    const categories = Array.from(set).sort()
    res.json({ categories })
  } catch (e) {
    res.status(500).json({ message: 'Unable to fetch categories' })
  }
}
