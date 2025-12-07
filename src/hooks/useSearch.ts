import useSWR from 'swr'
import { getProducts } from '@/lib/api-client'

export const useSearch = (q?: string) => {
  const fetcher = async (params: { q?: string; limit?: number }) => {
    const res = await getProducts(params)
    // Normalize paginated or plain-array responses
    if (!res) return []
    if (Array.isArray(res)) return res
    if (Array.isArray((res as any).results)) return (res as any).results
    if (Array.isArray((res as any).items)) return (res as any).items
    return []
  }

  const key = q ? JSON.stringify({ q, limit: 5 }) : null
  const { data, error } = useSWR(key, (k) => fetcher(JSON.parse(k)), { revalidateOnFocus: false })
  return { items: data ?? [], loading: !data && !error, error }
}
