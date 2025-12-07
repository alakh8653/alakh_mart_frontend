import Link from 'next/link'
import { FC } from 'react'

export const Breadcrumbs: FC<{ items: { label: string; href?: string }[] }> = ({ items = [] }) => {
  return (
    <nav className="text-sm text-gray-600 mb-3">
      {items.map((it, idx) => (
        <span key={idx}>
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span>{it.label}</span>}
          {idx < items.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  )
}
