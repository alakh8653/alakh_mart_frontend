import { NextApiRequest, NextApiResponse } from 'next'
import { getOrder, updateOrder } from '@/lib/orders'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string
  const userId = req.headers['x-user-id'] as string | undefined
  const userRole = req.headers['x-user-role'] as string | undefined
  const order = await getOrder(id)
  if (!order) return res.status(404).json({ error: 'Not found' })
  if (req.method === 'GET') {
    if (order.userId && order.userId !== userId && userRole !== 'admin') return res.status(403).json({ error: 'Not authorized' })
    return res.json(order)
  }
  if (req.method === 'PUT') {
    if (order.userId && order.userId !== userId && userRole !== 'admin') return res.status(403).json({ error: 'Not authorized' })
    const change = req.body
    const updated = await updateOrder(id, change)
    return res.json(updated)
  }
  res.setHeader('Allow', ['GET', 'PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
