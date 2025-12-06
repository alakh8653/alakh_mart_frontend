import { NextApiRequest, NextApiResponse } from 'next'
import { confirmIntent, getIntent } from '@/lib/payments'

// Demo webhook simulation endpoint. Use a secret header for verification.
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? 'demo-secret'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed')
  const secret = req.headers['x-webhook-secret'] as string | undefined
  if (secret !== WEBHOOK_SECRET) return res.status(401).json({ error: 'Invalid webhook secret' })
  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Intent id required' })
  const intent = getIntent(id)
  if (!intent) return res.status(404).json({ error: 'Intent not found' })
  try {
    const confirmed = confirmIntent(id)
    // webhook: notify application; for demo we simply return
    return res.json({ success: true, intent: confirmed })
  } catch (e) {
    return res.status(500).json({ error: 'Failed to confirm intent' })
  }
}
