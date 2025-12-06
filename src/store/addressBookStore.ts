import { create } from 'zustand'
import { persist, PersistStorage } from 'zustand/middleware'

export type Address = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  isDefault?: boolean
}

export type PaymentMethod = {
  id: string
  type: 'card' | 'paypal'
  last4: string
  brand?: string
  isDefault?: boolean
}

type AddressBookState = {
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  addAddress: (addr: Omit<Address, 'id'>) => void
  updateAddress: (id: string, addr: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  deletePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useAddressBookStore = create<AddressBookState>()(
  persist(
    (set, get) => ({
      addresses: [],
      paymentMethods: [],
      
      addAddress: (addr) => set((state) => ({
        addresses: [...state.addresses, { ...addr, id: generateId() }]
      })),
      
      updateAddress: (id, addr) => set((state) => ({
        addresses: state.addresses.map((a) => a.id === id ? { ...a, ...addr } : a)
      })),
      
      deleteAddress: (id) => set((state) => ({
        addresses: state.addresses.filter((a) => a.id !== id)
      })),
      
      setDefaultAddress: (id) => set((state) => ({
        addresses: state.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id
        }))
      })),
      
      addPaymentMethod: (method) => set((state) => ({
        paymentMethods: [...state.paymentMethods, { ...method, id: generateId() }]
      })),
      
      deletePaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.filter((m) => m.id !== id)
      })),
      
      setDefaultPaymentMethod: (id) => set((state) => ({
        paymentMethods: state.paymentMethods.map((m) => ({
          ...m,
          isDefault: m.id === id
        }))
      }))
    }),
    { name: 'alakh-addressbook' }
  )
)
