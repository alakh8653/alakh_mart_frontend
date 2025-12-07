import useSWR from 'swr'
import { getProducts, getProductById } from '@/lib/api-client'
import { Product } from '@/types'

const fetcher = async (key: string) => {
  // key format: "list:<json>" or "byId:<id>". split only at first ':' to
  // allow JSON payloads containing colons.
  const idx = key.indexOf(':')
  const method = idx === -1 ? key : key.slice(0, idx)
  const param = idx === -1 ? '' : key.slice(idx + 1)

  if (method === 'list') {
    let params = {}
    try {
      params = JSON.parse(param || '{}')
    } catch (e) {
      params = {}
    }
    const res = await getProducts(params as any)
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

  // API can return either an array or a paginated object. Normalize both.
  let items: Product[] = []
  let total: number | undefined = undefined

  if (!data) {
    items = []
  } else if (Array.isArray(data)) {
    items = data as Product[]
    total = items.length
  } else if (Array.isArray((data as any).results)) {
    items = (data as any).results as Product[]
    total = (data as any).count ?? items.length
  } else if (Array.isArray((data as any).items)) {
    items = (data as any).items as Product[]
    total = (data as any).total ?? items.length
  } else {
    // Fallback: try to treat the data as a single product
    items = (data as any) ? [data as Product] : []
    total = items.length
  }

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
