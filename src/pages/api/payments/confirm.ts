import { NextApiRequest, NextApiResponse } from 'next'
import { confirmIntent, getIntent } from '@/lib/payments'
import { getOrder } from '@/lib/orders'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')
  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Intent id required' })
  try {
    const intent = await getIntent(id)
    if (!intent) return res.status(404).json({ error: 'Intent not found' })
    const session = await getServerSession(req, res, authOptions)
    const requestUserId = session?.user?.id as string | undefined ?? (req.headers['x-user-id'] as string | undefined)
    const requestUserRole = session?.user?.isAdmin ? 'admin' : (req.headers['x-user-role'] as string | undefined)
    if (intent.orderId) {
      const order = await getOrder(intent.orderId)
      if (order) {
        if (order.userId && order.userId !== requestUserId && requestUserRole !== 'admin') {
          return res.status(403).json({ error: 'Not authorized to confirm payment for this order' })
        }
      }
    }
    const confirmed = await confirmIntent(id)
    res.json({ success: true, intent: confirmed })
  } catch (e) {
    res.status(404).json({ error: 'Intent not found' })
  }
}
