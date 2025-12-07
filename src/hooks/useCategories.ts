import useSWR from 'swr'
import { getCategories } from '@/lib/api-client'

const fetcher = async () => {
  const res = await getCategories()
  // Backend returns an array of categories; normalize to simple string list
  if (!res) return []
  if (Array.isArray(res)) return res
  // If each item is an object with `name`, map to name
  if (Array.isArray((res as any).results)) return (res as any).results
  return []
}

export const useCategories = () => {
  const { data, error } = useSWR('categories', fetcher, { revalidateOnFocus: false })
  // If the category objects are full objects, map to name/slug consumers expect
  const categories = (data ?? []).map((c: any) => (typeof c === 'string' ? c : c.name || c.slug || c))
  return { categories, loading: !data && !error, error }
}
