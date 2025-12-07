import { FC } from 'react'

export const Pagination: FC<{ page: number; total: number; perPage: number; onPage: (n: number) => void }> = ({ page, total, perPage, onPage }) => {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null
  return (
    <div className="flex gap-2 items-center">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="px-2 py-1 border rounded">Prev</button>
      <div>
        Page {page} of {pages}
      </div>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="px-2 py-1 border rounded">Next</button>
    </div>
  )
}
