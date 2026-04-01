import { PrismaAdapter } from '@auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
      authorization: { params: { scope: 'openid profile email' } },
      issuer: 'https://www.linkedin.com',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      profile(profile) {
        return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Check ADMIN_EMAILS env var first (comma-separated list)
        const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
        const isEnvAdmin = user.email ? adminEmails.includes(user.email.toLowerCase()) : false
        if (isEnvAdmin) {
          token.role = 'admin'
        } else {
          const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
          token.role = dbUser?.role ?? 'user'
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string; role: string }).id = token.id as string;
        (session.user as typeof session.user & { id: string; role: string }).role = token.role as string
      }
      return session
    },
  },
  pages: { signIn: '/auth/signin' },
}
