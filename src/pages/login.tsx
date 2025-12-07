import Head from 'next/head'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'next/router'
// next-auth imports unused here; using local demo auth

// Header/Footer provided by Layout
export default function Login(){
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  return (
    <div>
      <Head>
        <title>Login - AlakhMart</title>
      </Head>
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form
          className="max-w-md space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            await login(email, password)
            const next = (router.query.next as string) ?? '/'
            router.push(next)
          }}
        >
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="Password" type="password" />
          <div className="flex items-center gap-2"><input type="checkbox" checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)} /> <span className="text-sm">Login as admin (demo)</span></div>
          <button className="bg-orange-500 px-4 py-2 rounded text-white">Login</button>
        </form>
      </main>
    </div>
  )
}
