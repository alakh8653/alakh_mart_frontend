import { signIn, signOut, useSession } from 'next-auth/react'

export const useAuth = () => {
  const { data: session } = useSession()
  const user = (session?.user ?? null) as any
  const login = async (email: string, options?: any) => {
    // we call the next-auth signIn with 'credentials'
    return await signIn('credentials', { redirect: false, email, password: 'demo', isAdmin: options?.isAdmin })
  }
  const logout = () => signOut({ redirect: false })
  return { user, login, logout }
}
