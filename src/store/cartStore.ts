import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

type CartState = {
  items: CartItem[]
  addItem: (productId: string, qty?: number) => void
  removeItem: (productId: string) => void
  updateItem: (productId: string, qty: number) => void
  clear: () => void
  totalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, qty = 1) =>
        set((state) => {
          const exists = state.items.find((it) => it.productId === productId)
          if (exists) {
            return { items: state.items.map((it) => (it.productId === productId ? { ...it, quantity: it.quantity + qty } : it)) }
          }
          return { items: [...state.items, { productId, quantity: qty }] }
        }),
      removeItem: (productId) => set((s) => ({ items: s.items.filter((it) => it.productId !== productId) })),
      updateItem: (productId, qty) => set((s) => ({ items: s.items.map((it) => (it.productId === productId ? { ...it, quantity: qty } : it)) })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, cur) => acc + cur.quantity, 0),
    }),
    { name: 'alakh-cart' }
  )
)
