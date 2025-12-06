// Simple in-memory order API
import { NextApiRequest, NextApiResponse } from 'next'
import { createOrder, getOrder, listOrders, listOrdersForUser } from '@/lib/orders'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
// persistence was used in the previous version; using Prisma now via db

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const session = await getServerSession(req, res, authOptions)
  const requestUserId = session?.user?.id as string | undefined ?? (req.headers['x-user-id'] as string | undefined)
  const requestUserRole = session?.user?.isAdmin ? 'admin' : (req.headers['x-user-role'] as string | undefined)
  if (method === 'POST') {
    const { items, total, shipping } = req.body
    if (!items || !total || !shipping) return res.status(400).json({ error: 'Missing order payload' })
    const order = await createOrder({ items, total, shipping, userId: requestUserId ?? null })
    // ensure persisted
    // no-op: createOrder writes to disk
    return res.status(201).json(order)
  }
  if (method === 'GET') {
    const id = req.query.id as string | undefined
    if (id) {
      const order = await getOrder(id)
      if (!order) return res.status(404).json({ error: 'Not found' })
      // Only the owner or admin may retrieve single order
      if (order.userId && order.userId !== requestUserId && requestUserRole !== 'admin') return res.status(403).json({ error: 'Not authorized' })
      return res.json(order)
    }
    // Return either user orders or all orders for admin
    if (requestUserRole === 'admin') return res.json(await listOrders())
    if (requestUserId) return res.json(await listOrdersForUser(requestUserId))
    return res.status(403).json({ error: 'Not authorized' })
  }
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${method} Not Allowed`)
}
