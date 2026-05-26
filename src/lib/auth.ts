import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        return user
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => ({ ...session, user: { ...session.user, id: token.sub, role: token.role } }),
    jwt: ({ token, user }) => { if (user) token.role = (user as any).role; return token },
  },
  pages: { signIn: '/auth/login' },
  session: { strategy: 'jwt' },
}
