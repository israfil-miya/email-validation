import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '../../../utils/hash.js'
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'signin',
      name: 'signin',
      async authorize(credentials) {
        const { email, password } = credentials
        if (!email || !password) return null
        const res = await fetch(process.env.NEXTAUTH_URL + '/api/user-api', {
          method: 'POST',
          body: JSON.stringify({ email, signin: true }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const user = await res.json()

        if (user && !user.error) {
          const decryptedPass = await verifyPassword(password, user.password)
          if (!decryptedPass) return null
          return user
        }
        throw new Error(user.message)
      },
    }),
    CredentialsProvider({
      id: 'signup',
      name: 'signup',
      async authorize(credentials) {
        const { name, email, password } = credentials
        if (!name || !email || !password) return null
        const res = await fetch(process.env.NEXTAUTH_URL + '/api/user-api', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, signup: true }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const user = await res.json()
        // console.log("the user", user)

        if (user && !user.error) {
          return user
        }
        throw new Error(user.message)
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    encryption: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return Promise.resolve(token)
    },

    async session({ session, token }) {
      session.user = token.user
      return Promise.resolve(session)
    },
  },
  pages: {
    signIn: '/register',
    error: '/register',
  },
})
