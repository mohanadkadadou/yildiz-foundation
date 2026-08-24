import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => (token as any)?.role === 'ADMIN',
  },
  pages: { signIn: '/auth/login' },
})

export const config = { matcher: ['/admin/:path*'] }
