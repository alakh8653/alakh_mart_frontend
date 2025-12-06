import db from './db'
import { Product as ProductType } from '@/types'

export async function getProductsDB(params?: { q?: string; category?: string; page?: number; limit?: number }) {
  const page = params?.page ?? 1
  const limit = params?.limit ?? 12
  const skip = (page - 1) * limit
  const where: any = {}
  if (params?.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } }
    ]
  }
  if (params?.category) {
    where.categories = { has: params.category }
  }
  const [items, total] = await Promise.all([
    db.product.findMany({ where, skip, take: limit }),
    db.product.count({ where })
  ])
  return { items: items.map((p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: { amount: p.priceAmount, currency: p.priceCurrency },
    images: (() => {
      try { return JSON.parse(p.images) } catch(e) { return Array.isArray(p.images) ? p.images : [String(p.images)] }
    })(),
    rating: p.rating,
    reviews: p.reviews,
    categories: (() => {
      try { return JSON.parse(p.categories) } catch(e) { return Array.isArray(p.categories) ? p.categories : [String(p.categories)] }
    })(),
    stock: p.stock,
    featured: p.featured,
  }) as ProductType), total, page }
}

export async function getProductByIdDB(id: string) {
  const p = await db.product.findUnique({ where: { id } })
  if (!p) return null
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: { amount: p.priceAmount, currency: p.priceCurrency },
    images: (() => {
      try { return JSON.parse(p.images) } catch(e) { return Array.isArray(p.images) ? p.images : [String(p.images)] }
    })(),
    rating: p.rating,
    reviews: p.reviews,
    categories: (() => {
      try { return JSON.parse(p.categories) } catch(e) { return Array.isArray(p.categories) ? p.categories : [String(p.categories)] }
    })(),
    stock: p.stock,
    featured: p.featured,
  } as ProductType
}
