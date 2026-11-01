import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user?.passwordHash) return null

        const passwordMatch = await bcryptjs.compare(
          parsed.data.password,
          user.passwordHash
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as { id: string; email: string; name: string; role: 'ADMIN' | 'CUSTOMER' }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: 'ADMIN' | 'CUSTOMER' }).role ?? 'CUSTOMER'
      }
      return token
    },
    async session({ session, token }) {
      const user = session.user as Record<string, unknown>
      user.id = token.id
      user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`)
    },
    async signOut() {
      console.log('User signed out')
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
