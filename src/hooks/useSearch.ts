import useSWR from 'swr'
import { getProducts } from '@/lib/mock-api'

const fetcher = async (key: string) => {
  const params = JSON.parse(key)
  return await getProducts(params)
}

export const useSearch = (q?: string) => {
  const key = q ? JSON.stringify({ q, limit: 5 }) : null
  const { data, error } = useSWR(key, fetcher, { revalidateOnFocus: false })
  return { items: data?.items, loading: !data && !error, error }
}
