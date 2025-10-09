import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  basePath: "/api/auth",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined, // Convert null to undefined
            role: user.role,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = (user as unknown as { id: string }).id;
        token.role = (user as unknown as { role?: 'USER' | 'ADMIN' | 'INVESTOR' }).role ?? 'USER';
      }
      
      // Si c'est un appel de mise à jour de session, récupérer les données fraîches
      if (trigger === 'update' && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            console.log('JWT: Role updated from database:', dbUser.role);
          }
        } catch (error) {
          console.error('Error fetching fresh user role:', error);
        }
      }
      
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        // next-auth module augmentation defines these properties
        (session.user as unknown as { id: string }).id = token.id as string;
        (session.user as unknown as { role: 'USER' | 'ADMIN' | 'INVESTOR' }).role = (token as unknown as { role?: 'USER' | 'ADMIN' | 'INVESTOR' }).role ?? 'USER';
      }
      return session;
    },
  },
});
