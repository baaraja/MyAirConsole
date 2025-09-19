import { router, publicProcedure } from '@/lib/trpc';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const protectedProcedure = publicProcedure.use(async ({ next }) => {
  const session = await auth();
  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: { session },
  });
});

export const userRouter = router({
  getUsers: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    });
    return users;
  }),

  getUserStats: publicProcedure.query(async () => {
    const [totalUsers, oauthUsers, emailUsers] = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.user.count({
        where: {
          password: {
            not: null,
          },
        },
      }),
    ]);
    
    return {
      total: totalUsers,
      oauth: oauthUsers,
      email: emailUsers,
    };
  }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: {
              provider: true,
              type: true,
            },
          },
        },
      });
      return user;
    }),

  createUser: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(['USER', 'ADMIN']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Only admins can create users
      if (ctx.session?.user?.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can create users',
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          emailVerified: new Date(), // Auto-verify admin created users
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    }),

  updateUser: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      email: z.string().email(),
      role: z.enum(['USER', 'ADMIN']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Only admins can update users
      if (ctx.session?.user?.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can update users',
        });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Check if email is already taken by another user
      if (input.email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (emailTaken) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'This email is already used by another user',
          });
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Only admins can delete users
      if (ctx.session?.user?.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can delete users',
        });
      }

      // Prevent admin from deleting themselves
      if (input.id === ctx.session?.user?.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot delete your own account',
        });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Delete user
      await prisma.user.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
