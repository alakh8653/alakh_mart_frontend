import { Product } from '@/types'
import { useEffect, useMemo, useState, FC } from 'react'

export const Filters: FC<{ products?: Product[]; onFilter?: (filters: any) => void }> = ({ products = [], onFilter }) => {
  const categories = useMemo(() => Array.from(new Set(products.flatMap((p) => p.categories))), [products])
  const [enabledCat, setEnabledCat] = useState<string | null>(null)

  useEffect(() => {
    onFilter?.({ category: enabledCat })
  }, [enabledCat, onFilter])

  return (
    <div className="p-2 border rounded-md">
      <h4 className="font-semibold mb-2">Categories</h4>
      <div className="flex flex-col gap-1">
        {categories.map((c) => (
          <button key={c} onClick={() => setEnabledCat(c)} className={`text-left ${enabledCat === c ? 'font-semibold' : ''}`}>
            {c}
          </button>
        ))}
        <button onClick={() => setEnabledCat(null)} className="text-left mt-2 text-sm text-gray-500">Clear</button>
      </div>
    </div>
  )
}
