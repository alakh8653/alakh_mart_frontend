import { useEffect, useState, FC } from 'react'
import { useCategories } from '@/hooks/useCategories'

export const Filters: FC<{ onFilter?: (filters: any) => void }> = ({ onFilter }) => {
  const { categories, loading } = useCategories()
  const [enabledCat, setEnabledCat] = useState<string | null>(null)

  useEffect(() => {
    onFilter?.({ category: enabledCat })
  }, [enabledCat, onFilter])

  return (
    <div className="p-2 border rounded-md">
      <h4 className="font-semibold mb-2">Categories</h4>
      <div className="flex flex-col gap-1">
        {loading && <div className="px-2 py-1 text-sm text-gray-500">Loading…</div>}
        {categories.map((c: string) => (
          <button key={c} onClick={() => setEnabledCat(c)} className={`text-left ${enabledCat === c ? 'font-semibold' : ''}`}>
            {c}
          </button>
        ))}
        <button onClick={() => setEnabledCat(null)} className="text-left mt-2 text-sm text-gray-500">Clear</button>
      </div>
    </div>
  )
}
