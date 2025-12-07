import { v4 as uuidv4 } from 'uuid'
import { updateOrder } from './orders'
import db from './db'

export async function createIntent(orderId: string | undefined, amount: number) {
  const id = uuidv4()
  const clientSecret = `pi_${id}_secret_${Math.random().toString(36).slice(2, 10)}`
  const created = await db.paymentIntent.create({ data: { id, clientSecret, orderId, amount, status: 'requires_payment' } })
  return created as any
}
export async function confirmIntent(id: string) {
  const intent = await db.paymentIntent.findUnique({ where: { id } })
  if (!intent) throw new Error('not found')
  const updated = await db.paymentIntent.update({ where: { id }, data: { status: 'succeeded' } })
  // Map succeed to order paid
  if (updated.orderId) {
    await updateOrder(updated.orderId, { status: 'paid', paidAt: new Date().toISOString() } as any)
  }
  return updated as any
}
export async function getIntent(id: string) {
  return (await db.paymentIntent.findUnique({ where: { id } })) as any
}
