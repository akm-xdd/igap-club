import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHubProvider from "next-auth/providers/github"

// Create a global Prisma instance to prevent multiple instances
const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/login/x7k9m2p5q8w1',
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id
        session.user.githubUsername = user.githubUsername || user.name || 'user'
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Store GitHub username during sign in
      if (account?.provider === 'github' && profile?.login) {
        try {
          // Use upsert instead of update to handle user creation
          await prisma.user.upsert({
            where: { id: user.id },
            update: { githubUsername: profile.login },
            create: {
              id: user.id,
              email: user.email,
              name: user.name,
              githubUsername: profile.login,
              image: user.image
            }
          })
        } catch (error) {
          console.error('Error upserting GitHub username:', error)
          // Don't fail the sign-in if username update fails
        }
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Explicitly set the base path
  basePath: '/api/auth',
}