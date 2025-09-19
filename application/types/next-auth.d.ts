import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: 'USER' | 'ADMIN' | 'INVESTOR'
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role: 'USER' | 'ADMIN' | 'INVESTOR'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'USER' | 'ADMIN' | 'INVESTOR'
  }
}
