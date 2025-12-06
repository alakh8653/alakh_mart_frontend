import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import db from '@/lib/db'

export const authOptions = {
  adapter: PrismaAdapter(db as any),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'Is admin', type: 'boolean' }
      },
      async authorize(credentials) {
        const email = credentials?.email
        if (!email) return null
        // For demo, we don't check a real password; create or update user record
        const rawIsAdmin = credentials?.isAdmin
        const isAdmin = (rawIsAdmin as any) === true || String(rawIsAdmin) === 'true'
        const user = await db.user.upsert({ where: { email }, update: { isAdmin }, create: { email, name: email.split('@')[0], isAdmin } })
        return { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }
      }
    })
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (user) {
        session.user = { ...session.user, id: (user as any).id, isAdmin: (user as any).isAdmin }
      }
      return session
    }
  },
}

export default NextAuth(authOptions)
