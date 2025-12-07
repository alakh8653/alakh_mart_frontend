import create from 'zustand'

type User = { id: string; email?: string; name?: string; isAdmin?: boolean }

type AuthState = {
  user?: User
  login: (...args: any[]) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  login: (email: string, role?: { isAdmin?: boolean }) => set({ user: { id: `u_${Math.random().toString(36).slice(2, 7)}`, email, name: email.split('@')[0], isAdmin: role?.isAdmin ?? false } }),
  logout: () => set({ user: undefined }),
}))
