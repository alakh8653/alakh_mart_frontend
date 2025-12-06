import useSWR from 'swr'
import { getProducts, getProductById } from '@/lib/mock-api'
import { Product } from '@/types'

const fetcher = async (key: string) => {
  const [method, param] = key.split(':')
  if (method === 'list') {
    const params = JSON.parse(param)
    const res = await getProducts(params)
    return res
  }
  if (method === 'byId') {
    const res = await getProductById(param)
    return res
  }
  return null
}

export const useProducts = (params?: { q?: string; category?: string; page?: number; limit?: number }) => {
  const key = `list:${JSON.stringify(params ?? { limit: 12, page: 1 })}`
  const { data, error } = useSWR(key, fetcher, { refreshInterval: 0 })
  const items = Array.isArray(data) ? (data as Product[]) : ((data as any)?.items as Product[] | undefined)
  const total = Array.isArray(data) ? (data as Product[]).length : ((data as any)?.total as number | undefined)
  return {
    items,
    total,
    loading: !error && !data,
    error,
  }
}

export const useProduct = (id?: string) => {
  const key = id ? `byId:${id}` : null
  const { data, error } = useSWR(key, fetcher)
  return { product: data as Product | null | undefined, loading: !data && !error, error }
}
