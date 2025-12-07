import { Order } from '@/types'
import db from './db'

// We now store orders in a database; keep a small fallback

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'> & { userId?: string | null }) {
  const created = await db.order.create({
    data: {
      userId: data.userId ?? null,
      total: data.total,
      status: 'pending',
      shipping: data.shipping as any,
      paymentIntentId: data.paymentIntentId ?? undefined,
      paidAt: data.paidAt ?? undefined,
      items: { create: data.items.map((it) => ({ productId: it.productId, quantity: it.quantity })) }
    },
    include: { items: true }
  })
  return created as any as Order
}

export async function getOrder(id: string) {
  return await db.order.findUnique({ where: { id }, include: { items: true } }) as any as Order | null
}

export async function listOrders() {
  return await db.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } }) as any as Order[]
}

export async function listOrdersByUser(userId: string | undefined, isAdmin = false) {
  if (isAdmin) return await listOrders()
  if (!userId) return []
  return await db.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' } }) as any as Order[]
}

export async function listOrdersForUser(userId: string | undefined) {
  if (!userId) return [] as Order[]
  return await db.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: 'desc' } }) as any as Order[]
}

export async function updateOrder(id: string, change: Partial<Order>) {
  const updated = await db.order.update({ where: { id }, data: { ...change } as any, include: { items: true } })
  return updated as any as Order
}
