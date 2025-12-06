import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export const useCategories = () => {
  const { data, error } = useSWR('/api/categories', fetcher, { revalidateOnFocus: false })
  return { categories: data?.categories ?? [], loading: !data && !error, error }
}
