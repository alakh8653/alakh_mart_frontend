import useSWR from 'swr'
import { loginUser, registerUser, logoutUser, getCurrentUser } from '@/lib/api-client'

export const useAuth = () => {
  const { data: user, error, mutate } = useSWR('current_user', getCurrentUser, { revalidateOnFocus: false })

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password)
    // refresh current user cache
    try {
      await mutate()
    } catch (e) {
      // ignore
    }
    return res
  }

  const register = async (email: string, password: string, name?: string) => {
    const res = await registerUser(email, password, name || email.split('@')[0])
    try {
      await mutate()
    } catch (e) {}
    return res
  }

  const logout = async () => {
    await logoutUser()
    try {
      await mutate(null)
    } catch (e) {}
  }

  return { user: user ?? null, loading: !user && !error, error, login, logout, register }
}
