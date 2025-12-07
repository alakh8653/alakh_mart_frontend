import { NextApiRequest, NextApiResponse } from 'next'
import { createIntent } from '@/lib/payments'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getOrder } from '@/lib/orders'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')
  const { orderId, amount } = req.body
  if (!amount) return res.status(400).json({ error: 'Amount required' })
  // check owner or admin
  const session = await getServerSession(req, res, authOptions)
  const requestUserId = session?.user?.id as string | undefined ?? (req.headers['x-user-id'] as string | undefined)
  const requestUserRole = session?.user?.isAdmin ? 'admin' : (req.headers['x-user-role'] as string | undefined)
  if (orderId) {
    const order = await getOrder(orderId)
    if (order) {
      if (order.userId && order.userId !== requestUserId && requestUserRole !== 'admin') return res.status(403).json({ error: 'Not authorized' })
    }
  }
  const intent = await createIntent(orderId, amount)
  // persist intents file has been updated in the payments lib, but return current list
  // the DB is updated inside createIntent
  res.json({ clientSecret: intent.clientSecret, id: intent.id })
}
