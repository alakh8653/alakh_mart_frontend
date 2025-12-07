import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/hooks/useAuth'
import { FiShoppingCart } from 'react-icons/fi'
import { useMemo, useState, useRef, FC, useEffect } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { useCategories } from '@/hooks/useCategories'
import { useRouter } from 'next/router'

export const Header: FC = () => {
  const total = useCartStore((s) => s.totalItems())
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const { items: suggestions } = useSearch(query)
  const { categories } = useCategories()
  const [openCategories, setOpenCategories] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const showSuggestions = useMemo(() => !!query && (suggestions?.length ?? 0) > 0, [query, suggestions])

  useEffect(() => {
    if (!showSuggestions) setActiveIndex(-1)
  }, [showSuggestions])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min((suggestions?.length ?? 0) - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(-1, i - 1))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions && suggestions[activeIndex]) {
        router.push(`/product/${suggestions[activeIndex].id}`)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex gap-6 items-center">
        <Link href="/" className="font-bold text-xl text-brand-900">AlakhMart</Link>

        <nav className="flex gap-4 ml-6 items-center relative">
          <Link href="/search">Products</Link>
          <div className="relative">
            <button onClick={() => setOpenCategories((v) => !v)} className="px-2 py-1 rounded hover:bg-gray-100">Categories</button>
            {openCategories && (
              <div className="absolute left-0 mt-2 bg-white border rounded shadow z-50 w-56 max-h-72 overflow-auto">
                {categories.length === 0 && <div className="px-3 py-2 text-sm text-gray-500">No categories</div>}
                {categories.map((c: string) => (
                  <Link key={c} href={`/search?category=${encodeURIComponent(c)}`} className="block px-3 py-2 hover:bg-gray-50">{c}</Link>
                ))}
              </div>
            )}
          </div>
          {user?.isAdmin && <Link href="/admin">Admin</Link>}
        </nav>

        <div className="ml-6 flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              className="px-3 py-2 border rounded w-full"
              placeholder="Search for products, brands and more"
            />

            {showSuggestions && (
              <div className="absolute left-0 right-0 bg-white border mt-1 rounded-md z-40 max-h-80 overflow-auto">
                {suggestions?.map((s: any, idx: number) => (
                  <Link
                    key={s.id}
                    href={`/product/${s.id}`}
                    className={`block px-3 py-2 hover:bg-gray-50 ${idx === activeIndex ? 'bg-gray-100' : ''}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    {s.title}
                  </Link>
                ))}
                <div className="px-3 py-2 text-sm text-gray-500">Press Enter to search</div>
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex gap-3 items-center">
          <Link href={user ? '/account' : '/login'}>{user ? user.username || user.email || user.name : 'Account'}</Link>
          <Link href="/cart" className="relative flex items-center">
            <FiShoppingCart size={20} />
            {total > 0 && (
              <span className="absolute -right-2 -top-2 bg-red-500 text-xs text-white rounded-full px-1">{total}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
